import React from 'react';
import { Globe, Target, Eye, Heart, Users } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Globe,
      title: 'Environmental Responsibility',
      description: 'Committed to reducing electronic waste and protecting our planet for future generations.'
    },
    {
      icon: Target,
      title: 'Transparency',
      description: 'Complete traceability from device disposal to final recycling with QR-powered tracking.'
    },
    {
      icon: Heart,
      title: 'Community Impact',
      description: 'Building a community of environmentally conscious individuals and organizations.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working together with collectors, recyclers, and users to create sustainable solutions.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-eco-50 section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About E-Waste Loop
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're on a mission to revolutionize electronic waste management through 
            innovative technology and sustainable practices.
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">The E-Waste Problem</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Electronic waste is the fastest-growing waste stream globally, with over 
                  <span className="font-semibold text-red-600"> 54 million tons</span> generated annually.
                </p>
                <p>
                  Only <span className="font-semibold text-red-600">20%</span> of e-waste is properly recycled, 
                  while the rest ends up in landfills or is improperly processed, causing environmental damage.
                </p>
                <p>
                  Lack of transparency and traceability in the recycling process leads to 
                  inefficient resource recovery and environmental concerns.
                </p>
              </div>
            </div>
            <div className="bg-red-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-red-600 mb-2">54M</div>
                  <div className="text-sm text-gray-600">Tons of E-Waste Annually</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600 mb-2">80%</div>
                  <div className="text-sm text-gray-600">Improperly Disposed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600 mb-2">$62B</div>
                  <div className="text-sm text-gray-600">Lost Material Value</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600 mb-2">5%</div>
                  <div className="text-sm text-gray-600">Annual Growth Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="bg-gray-50 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Solution</h2>
            <p className="text-xl text-gray-600">Innovative technology for transparent e-waste management</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-primary-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
                  <div className="text-sm text-gray-600">Traceable Process</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">QR</div>
                  <div className="text-sm text-gray-600">Powered Tracking</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">Real-time</div>
                  <div className="text-sm text-gray-600">Updates</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">Rewards</div>
                  <div className="text-sm text-gray-600">For Participation</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Transparency</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our QR-powered tracking system provides complete visibility into the 
                  e-waste recycling process from device disposal to final material recovery.
                </p>
                <p>
                  Users can track their devices in real-time, receive certificates of 
                  proper disposal, and earn rewards for their environmental contributions.
                </p>
                <p>
                  We connect users, collectors, and recyclers in a transparent ecosystem 
                  that ensures responsible e-waste management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card">
              <Target className="h-12 w-12 text-primary-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To create a transparent, traceable, and rewarding ecosystem for electronic 
                waste management that empowers individuals and organizations to make 
                environmentally responsible choices while maximizing resource recovery.
              </p>
            </div>
            <div className="card">
              <Eye className="h-12 w-12 text-eco-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                A world where every electronic device is responsibly recycled, where 
                transparency drives trust, and where sustainable practices are rewarded, 
                creating a circular economy for electronic materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card">
                <value.icon className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;