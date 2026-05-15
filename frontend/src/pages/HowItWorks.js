import React, { useState } from 'react';
import { QrCode, Smartphone, Truck, MapPin, Award, CheckCircle, ShoppingCart, Home } from 'lucide-react';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('current');

  const currentSteps = [
    {
      icon: MapPin,
      title: 'Find Nearby E-Waste Bin',
      description: 'Open the web app and see a map with nearby e-waste bins. Go to the nearest bin.',
      details: ['Interactive map view', 'GPS location of bins', 'Distance and directions']
    },
    {
      icon: QrCode,
      title: 'Scan the QR Code',
      description: 'Each bin has a unique QR code. Scan it using the app to identify that bin.',
      details: ['Unique bin identification', 'Instant QR scanning', 'Bin verification']
    },
    {
      icon: Smartphone,
      title: 'Fill E-Waste Info',
      description: 'A form opens where you enter type of e-waste, quantity/weight, and optional photo.',
      details: ['Device type selection', 'Weight/quantity input', 'Photo upload option']
    },
    {
      icon: ShoppingCart,
      title: 'Marketplace',
      description: 'Your e-waste details appear on the Marketplace where recycling companies can purchase.',
      details: ['Automatic listing', 'Company visibility', 'Purchase requests']
    },
    {
      icon: Award,
      title: 'Recycle & Reward',
      description: 'Company collects and recycles the e-waste. You receive cashback, vouchers, or reward points.',
      details: ['Cashback rewards', 'Voucher system', 'Points accumulation']
    }
  ];

  const futureSteps = [
    {
      icon: Home,
      title: 'Scan from Anywhere',
      description: 'Scan the QR code from home or anywhere without going to a bin.',
      details: ['Home pickup service', 'No travel required', 'Convenient scheduling']
    },
    {
      icon: Truck,
      title: 'Pickup Request',
      description: 'The app sends a pickup request to nearby certified collectors automatically.',
      details: ['Automated requests', 'Certified collectors', 'Service area matching']
    },
    {
      icon: MapPin,
      title: 'Direct Collection',
      description: 'Collector comes to pick up the e-waste directly from your location.',
      details: ['Door-to-door service', 'Scheduled pickup', 'Professional handling']
    },
    {
      icon: CheckCircle,
      title: 'Live Tracking',
      description: 'Track pickup, transport, and recycling status in real-time through the app.',
      details: ['Real-time updates', 'Status notifications', 'Complete transparency']
    },
    {
      icon: Award,
      title: 'Automatic Rewards',
      description: 'Once recycling is complete, you automatically receive rewards.',
      details: ['Instant rewards', 'Automated processing', 'Impact tracking']
    }
  ];



  const WorkflowSection = ({ steps, bgColor }) => (
    <section className={`${bgColor} py-16`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 relative hover:shadow-xl transition-shadow">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <step.icon className="h-10 w-10 text-primary-600" />
              </div>
              <div className="absolute -top-3 -left-3 bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{step.title}</h3>
              <p className="text-gray-600 text-center mb-6 text-base leading-relaxed">{step.description}</p>
              <ul className="space-y-2">
                {step.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-eco-50 py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How E-Waste Loop Works
          </h1>
          <p className="text-lg text-gray-600 leading-normal mb-6">
            Simple steps to recycle your e-waste responsibly and earn rewards.
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'current'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-primary-500'
                }`}
              >
                Current Version
              </button>
              <button
                onClick={() => setActiveTab('future')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'future'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-primary-500'
                }`}
              >
                Future Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Current Version */}
      {activeTab === 'current' && (
        <>
          <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto text-center px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Current Version</h2>
              <p className="text-xl text-gray-600">Visit nearby e-waste bins to recycle your devices</p>
            </div>
          </section>
          <WorkflowSection steps={currentSteps} bgColor="bg-blue-50" />
        </>
      )}

      {/* Future Plan */}
      {activeTab === 'future' && (
        <>
          <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto text-center px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Future Plan - Next Phase</h2>
              <p className="text-xl text-gray-600">Home pickup service with live tracking and automatic rewards</p>
            </div>
          </section>
          <WorkflowSection steps={futureSteps} bgColor="bg-green-50" />
        </>
      )}

      {/* Technology Features */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Technology Features</h2>
            <p className="text-lg text-gray-300">Advanced features that make our system reliable and efficient</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-5">
              <QrCode className="h-10 w-10 text-primary-400 mb-3" />
              <h3 className="text-lg font-bold mb-2">QR Code Tracking</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Unique QR codes for each device enabling complete traceability throughout the recycling process.</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-5">
              <MapPin className="h-10 w-10 text-primary-400 mb-3" />
              <h3 className="text-lg font-bold mb-2">Real-time Location</h3>
              <p className="text-gray-300 text-sm leading-relaxed">GPS tracking of e-waste from pickup to final recycling destination with live updates.</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-5">
              <Award className="h-10 w-10 text-primary-400 mb-3" />
              <h3 className="text-lg font-bold mb-2">Digital Certificates</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Blockchain-verified certificates proving proper recycling and environmental compliance.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;