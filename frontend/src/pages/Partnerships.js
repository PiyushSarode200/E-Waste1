import React, { useState } from 'react';
import { Building2, CheckCircle, Shield, BarChart3, Users, Mail, Phone, MapPin } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import CompanyLayout from '../components/CompanyLayout';
import UserLayout from '../components/UserLayout';

const Partnerships = () => {
  const location = useLocation();
  const isCompanyRoute = location.pathname.startsWith('/company/');
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    companySize: '',
    partnershipType: '',
    message: ''
  });

  const partners = [
    { name: 'TechCorp Solutions', logo: '🏢', category: 'Enterprise' },
    { name: 'GreenTech Industries', logo: '🌱', category: 'Recycling' },
    { name: 'EcoLogistics', logo: '🚛', category: 'Collection' },
    { name: 'SmartDevices Inc', logo: '📱', category: 'Manufacturing' },
    { name: 'SustainableTech', logo: '♻️', category: 'Enterprise' },
    { name: 'CleanEnergy Corp', logo: '⚡', category: 'Energy' },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Compliance Assurance',
      description: 'Meet all regulatory requirements with automated compliance tracking and reporting',
      details: ['WEEE Directive compliance', 'RoHS certification', 'ISO 14001 alignment', 'Audit trail documentation']
    },
    {
      icon: BarChart3,
      title: 'Cost Optimization',
      description: 'Reduce operational costs through efficient e-waste management processes',
      details: ['Reduced disposal costs', 'Streamlined logistics', 'Bulk processing discounts', 'Tax incentives']
    },
    {
      icon: Users,
      title: 'Employee Engagement',
      description: 'Boost employee satisfaction with corporate sustainability initiatives',
      details: ['Gamified participation', 'Team competitions', 'Impact reporting', 'Recognition programs']
    },
    {
      icon: Building2,
      title: 'Brand Enhancement',
      description: 'Strengthen your brand reputation with transparent sustainability practices',
      details: ['Sustainability certificates', 'Public impact reports', 'Marketing materials', 'CSR documentation']
    }
  ];

  const partnershipTypes = [
    {
      title: 'Corporate Partner',
      description: 'For large enterprises with significant e-waste volumes',
      features: ['Dedicated account manager', 'Custom pickup schedules', 'Bulk processing rates', 'Advanced analytics'],
      price: 'Custom pricing'
    },
    {
      title: 'Collection Partner',
      description: 'For logistics companies and waste collectors',
      features: ['Route optimization tools', 'Mobile tracking app', 'Commission structure', 'Training support'],
      price: 'Revenue sharing'
    },
    {
      title: 'Recycling Partner',
      description: 'For certified recycling facilities',
      features: ['Intake management system', 'Quality verification tools', 'Compliance reporting', 'Material tracking'],
      price: 'Processing fees'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Partnership form submitted:', formData);
    // Handle form submission
  };

  const content = (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-eco-50 section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Corporate Partnerships
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Join leading companies in creating a sustainable future through 
            responsible e-waste management and transparent recycling practices.
          </p>
        </div>
      </section>

      {/* Current Partners */}
      <section className="bg-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted Partners</h2>
            <p className="text-xl text-gray-600">Companies already making a difference with E-Waste Loop</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="card text-center">
                <div className="text-4xl mb-3">{partner.logo}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{partner.name}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{partner.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="bg-gray-50 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Partnership Benefits</h2>
            <p className="text-xl text-gray-600">Why leading companies choose E-Waste Loop</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="card">
                <benefit.icon className="h-12 w-12 text-primary-600 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 mb-6">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
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

      {/* Partnership Types */}
      <section className="bg-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Partnership Options</h2>
            <p className="text-xl text-gray-600">Choose the partnership model that fits your business</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnershipTypes.map((type, index) => (
              <div key={index} className="card border-2 border-gray-200 hover:border-primary-300 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <ul className="space-y-3 mb-6">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-4">
                  <div className="text-lg font-bold text-primary-600 mb-3">{type.price}</div>
                  <button className="btn-primary w-full">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section className="bg-gray-50 section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Partner With Us</h2>
            <p className="text-xl text-gray-600">Ready to join the sustainable e-waste revolution?</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select company size</option>
                    <option value="1-50">1-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Type</label>
                  <select
                    name="partnershipType"
                    value={formData.partnershipType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select partnership type</option>
                    <option value="corporate">Corporate Partner</option>
                    <option value="collection">Collection Partner</option>
                    <option value="recycling">Recycling Partner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell us about your e-waste management needs..."
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full">
                Submit Partnership Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-xl text-primary-100 mb-8">
            Have questions about partnerships? Our team is here to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 text-primary-200 mb-3" />
              <div className="font-semibold mb-1">Email</div>
              <div className="text-primary-100">partnerships@ewasteloop.com</div>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 text-primary-200 mb-3" />
              <div className="font-semibold mb-1">Phone</div>
              <div className="text-primary-100">+1 (555) 123-4567</div>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-primary-200 mb-3" />
              <div className="font-semibold mb-1">Office</div>
              <div className="text-primary-100">123 Green St, Eco City</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return isCompanyRoute ? (
    <CompanyLayout>{content}</CompanyLayout>
  ) : (
    <UserLayout>{content}</UserLayout>
  );
};

export default Partnerships;