import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Zap } from 'lucide-react';
import jsQR from 'jsqr';

const QRScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        scanQRCode();
      }
    } catch (err) {
      setError('Camera access denied or not available');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          handleQRDetected(code.data);
          return;
        }
      }
      
      if (isScanning) {
        requestAnimationFrame(scan);
      }
    };

    scan();
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        handleQRDetected(code.data);
      } else {
        setError('No QR code detected. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleQRDetected = (qrData) => {
    stopCamera();
    
    // Check if QR data is a URL and redirect
    if (qrData.startsWith('http://') || qrData.startsWith('https://')) {
      const userConfirmed = window.confirm(`QR code contains a link: ${qrData}\n\nDo you want to open this link?`);
      if (userConfirmed) {
        window.open(qrData, '_blank');
      }
    }
    
    onScan(qrData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">QR Code Scanner</h3>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error ? (
          <div className="text-center py-8">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                  <div className="text-white text-sm text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2" />
                    Position QR code here
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Point your camera at a QR code to scan automatically or click capture
              </p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={captureFrame}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 inline-flex items-center"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Capture
                </button>
                <button
                  onClick={() => {
                    stopCamera();
                    onClose();
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;