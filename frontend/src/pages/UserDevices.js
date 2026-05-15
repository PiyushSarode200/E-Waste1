import React, { useState, useEffect } from 'react';
import { QrCode, HardDrive, Cpu, Tv, MonitorSmartphone, Calendar, CheckCircle } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import api from '../services/api';

const getDeviceIcon = (deviceType) => {
  switch (deviceType) {
    case 'Smartphone': return <MonitorSmartphone className="h-6 w-6 text-blue-500" />;
    case 'Laptop': return <Cpu className="h-6 w-6 text-purple-500" />;
    case 'Tablet': return <HardDrive className="h-6 w-6 text-indigo-500" />;
    case 'TV': return <Tv className="h-6 w-6 text-green-500" />;
    default: return <QrCode className="h-6 w-6 text-gray-500" />;
  }
};

const UserDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await api.getDevices();
        setDevices(res);
      } catch (err) {
        console.error('Failed to fetch devices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  return (
    <UserLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Devices</h1>
          <p className="text-gray-600">Track all the e-waste devices you have submitted.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-primary-600">Loading your devices...</div>
        ) : devices.length === 0 ? (
          <div className="p-12 text-center">
            <QrCode className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Devices Found</h3>
            <p className="text-gray-500">You haven't submitted any electronic devices yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {devices.map((device) => {
              const deviceName = `${device.brand || ''} ${device.model || ''}`.trim() || device.deviceType;
              const isQrScanned = device.source === 'qr_scan';

              return (
                <div key={device._id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg shrink-0">
                      {getDeviceIcon(device.deviceType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{deviceName}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-mono text-xs">
                          <QrCode className="h-3 w-3" /> {device.qrCode || device._id.slice(-8).toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> {new Date(device.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          {device.condition}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">
                        {device.ecoPoints} <span className="text-sm font-normal text-gray-500">pts</span>
                      </div>
                      {isQrScanned && (
                        <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded mt-1">
                          +20 QR Bonus
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      <CheckCircle className="h-4 w-4" /> Completed
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserDevices;
