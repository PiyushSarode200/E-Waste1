import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import CompanyLayout from '../components/CompanyLayout';

const Contact = () => {
  const location = useLocation();
  const isCompanyRoute = location.pathname.startsWith('/company/');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [expandedFaq, setExpandedFaq] = useState(null);

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      contact: 'support@ewasteloop.com',
      action: 'Send Email'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak with our team directly',
      contact: '+1 (555) 123-4567',
      action: 'Call Now'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Available 9 AM - 6 PM EST',
      action: 'Start Chat'
    }
  ];

  const faqs = [
    {
      question: 'How does the QR code tracking system work?',
      answer: 'Each device gets a unique QR code that tracks its journey from disposal to recycling. You can scan the code at any time to see real-time updates on your device\'s status and location.'
    },
    {
      question: 'What types of electronic devices can I recycle?',
      answer: 'We accept smartphones, tablets, laptops, desktop computers, monitors, keyboards, mice, cables, batteries, and most other electronic devices. Contact us if you\'re unsure about a specific item.'
    },
    {
      question: 'How do I earn and redeem reward points?',
      answer: 'You earn points for each device you recycle based on its type and condition. Points can be redeemed for eco-friendly products, vouchers, or donated to environmental causes through our rewards store.'
    },
    {
      question: 'Is my personal data secure during the recycling process?',
      answer: 'Yes, we follow strict data security protocols. We recommend wiping your devices before recycling, and our certified partners ensure complete data destruction as part of the recycling process.'
    },
    {
      question: 'How long does the recycling process take?',
      answer: 'The complete process typically takes 7-14 days from pickup to final recycling. You\'ll receive real-time updates throughout the journey and a completion certificate when finished.'
    },
    {
      question: 'Can businesses set up corporate recycling programs?',
      answer: 'Absolutely! We offer comprehensive corporate programs with bulk pickup, compliance reporting, employee engagement features, and custom pricing. Contact our partnerships team for details.'
    },
    {
      question: 'What happens to the materials after recycling?',
      answer: 'Recovered materials like metals, plastics, and rare earth elements are sold to manufacturers for use in new products, creating a circular economy and reducing the need for virgin materials.'
    },
    {
      question: 'Are there any costs for using E-Waste Loop?',
      answer: 'Basic recycling services are free for individuals. We make money through material recovery and corporate partnerships. Some premium services may have fees, which are clearly disclosed upfront.'
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
    console.log('Contact form submitted:', formData);
    // Handle form submission
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const content = (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-eco-50 section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact & Support
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Have questions about e-waste recycling? Need help with our platform? 
            We're here to assist you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="bg-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">Choose the best way to reach us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="card text-center">
                <method.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div className="text-primary-600 font-semibold mb-4">{method.contact}</div>
                <button className="btn-primary w-full">{method.action}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="bg-gray-50 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Address</h4>
                      <p className="text-gray-600">123 Green Street<br />Eco City, EC 12345<br />United States</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Business Hours</h4>
                      <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                        Saturday: 10:00 AM - 4:00 PM EST<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <HelpCircle className="h-6 w-6 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Emergency Support</h4>
                      <p className="text-gray-600">
                        For urgent issues, call our 24/7 emergency line:<br />
                        <span className="font-semibold text-primary-600">+1 (555) 911-HELP</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-primary-600 text-white rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">Our Response Times</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">&lt; 1 hr</div>
                    <div className="text-primary-200 text-sm">Live Chat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">&lt; 24 hrs</div>
                    <div className="text-primary-200 text-sm">Email Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">98%</div>
                    <div className="text-primary-200 text-sm">Satisfaction Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">24/7</div>
                    <div className="text-primary-200 text-sm">Emergency Line</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Find quick answers to common questions</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
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

export default Contact;