import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, Upload, CheckCircle, X, RotateCcw, Loader, Info } from 'lucide-react';
import jsQR from 'jsqr';
import UserLayout from '../components/UserLayout';
import api from '../services/api';
import { deviceCatalog, IMEI_REQUIRED_TYPES, calculatePoints } from '../data/deviceCatalog';

const QRScanPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [checking, setChecking] = useState(false);       // loading while checking QR
  const [existingDevice, setExistingDevice] = useState(null); // populated if QR already registered
  const [deviceForm, setDeviceForm] = useState({
    deviceType: '', brand: '', model: '', condition: '', imei: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [geoError, setGeoError] = useState('');
  const [geoLoading, setGeoLoading] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // Geolocation Hook
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      setGeoLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGeoLoading(false);
      },
      (err) => {
        setGeoError('Unable to retrieve your location. Please allow location access.');
        setGeoLoading(false);
      }
    );
  }, []);

  // Derived: available brands based on selected device type
  const availableBrands = deviceForm.deviceType
    ? Object.keys(deviceCatalog[deviceForm.deviceType] || {})
    : [];

  // Derived: available models based on selected brand
  const availableModels =
    deviceForm.deviceType && deviceForm.brand
      ? (deviceCatalog[deviceForm.deviceType]?.[deviceForm.brand] || [])
      : [];

  const needsImei = IMEI_REQUIRED_TYPES.includes(deviceForm.deviceType);

  // Reset brand + model when type changes
  const handleTypeChange = (value) => {
    setDeviceForm({ deviceType: value, brand: '', model: '', condition: deviceForm.condition, imei: '' });
  };

  // Reset model when brand changes
  const handleBrandChange = (value) => {
    setDeviceForm({ ...deviceForm, brand: value, model: '' });
  };

  // Fetch recent scans on component mount
  useEffect(() => {
    const fetchRecentScans = async () => {
      try {
        const devices = await api.getDevices();
        setRecentScans(devices.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch recent scans:', err);
      }
    };
    fetchRecentScans();
    return () => { stopCamera(); };
  }, []);

  // When a valid QR is scanned: check if it already exists
  const handleQRScanned = async (qrData) => {
    setScanResult({ qrData, scanned: true });
    setExistingDevice(null);
    setSubmitSuccess(false);
    setChecking(true);
    setError(null);
    try {
      const result = await api.checkQrCode(qrData);
      if (result.exists) {
        setExistingDevice(result.device); // View mode
      }
    } catch (err) {
      console.error('QR check failed:', err);
    } finally {
      setChecking(false);
    }
  };

  const handleDeviceSubmit = async (e) => {
    e.preventDefault();
    
    if (!location) {
      setError('Geolocation is required. Please enable location services.');
      return;
    }

    if (!imageFile) {
      setError('Device image proof is required.');
      return;
    }

    // IMEI validation applies to ALL devices due to backend rule
    if (!deviceForm.imei || deviceForm.imei.length !== 15 || !/^\d{15}$/.test(deviceForm.imei)) {
      setError('IMEI must be exactly 15 numeric digits.');
      return;
    }

    setSubmitting(true);
    setError('');

    const { ecoPoints, estimatedValue } = calculatePoints(deviceForm.condition);

    const formData = new FormData();
    formData.append('deviceType', deviceForm.deviceType);
    formData.append('brand', deviceForm.brand);
    formData.append('model', deviceForm.model);
    formData.append('condition', deviceForm.condition);
    formData.append('imei', deviceForm.imei);
    formData.append('estimatedValue', estimatedValue);
    formData.append('ecoPoints', ecoPoints);
    formData.append('qrCode', scanResult.qrData);
    formData.append('source', 'qr_scan');
    formData.append('lat', location.lat);
    formData.append('lng', location.lng);
    formData.append('image', imageFile);

    console.log('[QRScanPage] Submitting qr_scan FormData');

    try {
      await api.submitDevice(formData);
      const updated = await api.getDevices();
      setRecentScans(updated.slice(0, 5));
      setSubmitSuccess(true);
      setScanResult(null);
      setExistingDevice(null);
      setDeviceForm({ deviceType: '', brand: '', model: '', condition: '', imei: '' });
      setImageFile(null);
    } catch (err) {
      console.error('Submit failed:', err);
      setError(err.message || 'Failed to save device. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        
        videoRef.current.onloadedmetadata = () => {
          startQRDetection();
        };
      }
    } catch (err) {
      setError('Camera access denied or not available');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsScanning(false);
  };

  const startQRDetection = () => {
    intervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = detectQRCode(imageData);
        
        if (qrCode) {
          handleQRDetected(qrCode);
        }
      }
    }, 500);
  };

  const detectQRCode = (imageData) => {
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    return code ? code.data : null;
  };

  const handleQRDetected = (qrData) => {
    console.log('Scanned QR Data:', qrData);
    if (!qrData) return;
    const trimmedData = qrData.trim();
    if (trimmedData.length < 5) { setError('Invalid QR format'); return; }
    const lowerData = trimmedData.toLowerCase();
    const paymentKeywords = ['upi', 'pay', 'pa=', 'pn=', 'txn', 'bank', 'payment'];
    const isPaymentOrUrl =
      lowerData.startsWith('http://') ||
      lowerData.startsWith('https://') ||
      paymentKeywords.some(kw => lowerData.includes(kw));
    if (isPaymentOrUrl) { setError('Payment QR not allowed'); return; }
    const strictRegex = /^(EW|EWASTE|EQR)-[A-Z0-9-]+$/;
    if (!strictRegex.test(trimmedData)) { setError('Unknown QR code'); return; }
    stopCamera();
    setError(null);
    handleQRScanned(trimmedData); // <- calls the QR lookup
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = detectQRCode(imageData);
      
      if (qrCode) {
        handleQRDetected(qrCode);
      } else {
        // No fake fallback — tell user to try again
        setError('No QR code detected. Ensure the QR code is in frame and try again.');
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Draw the uploaded image onto an off-screen canvas to get pixel data
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = detectQRCode(imageData);

        console.log('[handleFileUpload] jsQR decoded result:', qrCode);

        if (qrCode) {
          handleQRDetected(qrCode);
        } else {
          setError('No QR code found in the uploaded image. Please try a clearer image.');
        }
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Scanner</h1>
        <p className="text-gray-600">Scan QR codes to track and verify e-waste devices</p>
      </div>

      {/* Scanner Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Scan QR Code</h2>
          
          {!isScanning && !scanResult && (
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <QrCode className="h-24 w-24 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={startCamera}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Start Camera Scan
                </button>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload QR Code Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="text-center">
              <div className="relative w-80 h-80 mx-auto mb-6 border-2 border-primary-500 rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary-400 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary-400 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary-400 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary-400 rounded-br-lg"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary-400 animate-pulse"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <button
                    onClick={captureImage}
                    className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-colors"
                  >
                    <Camera className="h-6 w-6" />
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-red-500/90 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <p className="text-primary-600 font-medium mb-2">Position QR code within the frame</p>
              <p className="text-sm text-gray-500">Camera will automatically detect QR codes</p>
            </div>
          )}

          {scanResult && (
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6 border-2 border-green-500 rounded-lg flex items-center justify-center bg-green-50">
                <CheckCircle className="h-24 w-24 text-green-600" />
              </div>
              <p className="text-green-600 font-medium mb-4">QR Code Scanned Successfully!</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setScanResult(null)}
                  className="flex-1 text-primary-600 hover:text-primary-700 font-medium border border-primary-300 py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Scan Another
                </button>

              </div>
            </div>
          )}
        </div>

        {/* Device Registration / Details Panel */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {checking ? 'Checking QR...' : existingDevice ? 'Device Details' : 'Register Device'}
            </h2>
            {scanResult && (
              <button
                onClick={() => { setScanResult(null); setExistingDevice(null); setSubmitSuccess(false); setError(null); }}
                className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
              >
                <RotateCcw className="h-4 w-4 mr-1" /> Scan Another
              </button>
            )}
          </div>

          {submitSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Device registered! Recent Scans updated.</span>
            </div>
          )}

          {/* No scan yet */}
          {!scanResult && !submitSuccess && (
            <div className="text-center py-12">
              <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Scan a valid E-Waste QR code</p>
              <p className="text-sm text-gray-400 mt-1">Form will appear here after scanning</p>
            </div>
          )}

          {/* Checking loader */}
          {checking && (
            <div className="flex items-center justify-center py-12 gap-3 text-primary-600">
              <Loader className="h-6 w-6 animate-spin" />
              <span>Looking up QR code...</span>
            </div>
          )}

          {/* View Mode — existing device */}
          {!checking && existingDevice && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-blue-800 text-sm font-medium">This QR is already registered. Showing device details.</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['QR Code', existingDevice.qrCode],
                  ['Device Type', existingDevice.deviceType],
                  ['Brand', existingDevice.brand],
                  ['Model', existingDevice.model || '—'],
                  ['IMEI', existingDevice.imei || '—'],
                  ['Condition', existingDevice.condition],
                  ['Status', existingDevice.status],
                  ['Eco Points', `+${existingDevice.ecoPoints} pts`],
                  ['Registered', new Date(existingDevice.createdAt).toLocaleDateString()],
                  ['Source', existingDevice.source === 'qr_scan' ? 'QR Scan' : 'Manual'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="font-medium text-gray-900 text-sm break-all">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Mode — new device registration */}
          {!checking && scanResult && !existingDevice && (
            <form onSubmit={handleDeviceSubmit} className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-green-800 text-sm font-medium break-all">New QR: {scanResult.qrData}</span>
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

              {geoLoading ? (
                <div className="text-blue-700 bg-blue-100 p-3 rounded-lg text-sm">Acquiring GPS location...</div>
              ) : geoError ? (
                <div className="text-red-700 bg-red-100 p-3 rounded-lg text-sm">{geoError}</div>
              ) : (
                <div className="text-green-700 bg-green-100 p-3 rounded-lg flex items-center text-sm">
                  <span>📍 Location Acquired ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})</span>
                </div>
              )}

              {/* Device Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                <select value={deviceForm.deviceType} onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required>
                  <option value="">Select device type</option>
                  {Object.keys(deviceCatalog).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Brand (cascades from type) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select value={deviceForm.brand} onChange={(e) => handleBrandChange(e.target.value)}
                  disabled={!deviceForm.deviceType}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100" required>
                  <option value="">{deviceForm.deviceType ? 'Select brand' : 'Select device type first'}</option>
                  {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Model (cascades from brand) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <select value={deviceForm.model} onChange={(e) => setDeviceForm({...deviceForm, model: e.target.value})}
                  disabled={!deviceForm.brand}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100">
                  <option value="">{deviceForm.brand ? 'Select model' : 'Select brand first'}</option>
                  {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* IMEI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IMEI Number <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-400 ml-1">(15 digits)</span>
                </label>
                <input type="text" value={deviceForm.imei} inputMode="numeric" maxLength={15}
                  onChange={(e) => setDeviceForm({...deviceForm, imei: e.target.value.replace(/\D/g, '')})}
                  placeholder="Enter 15-digit IMEI number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required />
                {deviceForm.imei && deviceForm.imei.length !== 15 && (
                  <p className="text-xs text-red-500 mt-1">{15 - deviceForm.imei.length} more digits needed</p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select value={deviceForm.condition} onChange={(e) => setDeviceForm({...deviceForm, condition: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required>
                  <option value="">Select condition</option>
                  <option value="working">Working — Fully functional (+50 pts)</option>
                  <option value="needs_repair">Needs Repair — Minor issues (+70 pts)</option>
                  <option value="broken">Broken — Dead / Non-functional (+100 pts)</option>
                </select>
              </div>

              {/* Device Image Proof */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Image Proof</label>
                <input 
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary-500" 
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setScanResult(null)}
                  className="w-1/3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || geoLoading || !!geoError}
                  className={`w-2/3 py-3 text-white rounded-lg transition-colors flex items-center justify-center ${submitting || geoLoading || !!geoError ? 'bg-gray-400 cursor-not-allowed opacity-60' : 'bg-primary-600 hover:bg-primary-700'}`}>
                  {submitting ? <><Loader className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : 'Register Scanned Device'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Recent Scans — Live from MongoDB */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Scans</h2>
        <div className="space-y-3">
          {recentScans.length === 0 ? (
            <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg">
              No devices scanned yet. Scan a QR code to register your first device!
            </div>
          ) : (
            recentScans.map((device) => (
              <div key={device._id} className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 ${
                device.source === 'qr_scan' ? 'border-primary-200 bg-primary-50/30' : 'border-gray-200'
              }`}>
                <div className="flex items-center">
                  <QrCode className={`h-5 w-5 mr-3 ${device.source === 'qr_scan' ? 'text-primary-500' : 'text-gray-400'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{device.qrCode || device._id.slice(-8).toUpperCase()}</p>
                      <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                        device.source === 'qr_scan'
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {device.source === 'qr_scan' ? 'QR Scan' : 'Manual'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {device.brand} {device.deviceType} • {new Date(device.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 text-sm font-medium">+{device.ecoPoints} pts</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    device.status === 'recycled' ? 'bg-green-100 text-green-800' :
                    device.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {device.status ? device.status.charAt(0).toUpperCase() + device.status.slice(1) : 'Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default QRScanPage;