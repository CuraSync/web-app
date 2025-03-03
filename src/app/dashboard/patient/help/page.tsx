"use client";
import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, HelpCircle, FileText, ChevronDown, ChevronUp, Send } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

const HelpSupportPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      question: "How do I schedule an appointment with a doctor?",
      answer: "You can schedule an appointment by navigating to the 'Doctor' section in your dashboard, selecting your preferred doctor, and clicking on the 'Schedule' button. Follow the prompts to select a date and time that works for you.",
      isOpen: false
    },
    {
      question: "How can I view my lab test results?",
      answer: "Your lab test results can be accessed in the 'Laboratory' section of your dashboard. Click on the specific test to view detailed results. You can also download or print these results for your records.",
      isOpen: false
    },
    {
      question: "How do I update my personal information?",
      answer: "To update your personal information, go to the 'Settings' page and click on the edit icon next to your profile information. Make the necessary changes and save your updates.",
      isOpen: false
    },
    {
      question: "Can I share my medical records with a new doctor?",
      answer: "Yes, you can share your medical records with a new doctor. Navigate to your medical records in the 'Timeline' section, select the records you want to share, and use the 'Share' option to send them to your new doctor.",
      isOpen: false
    },
    {
      question: "How do I message my healthcare providers?",
      answer: "You can message your healthcare providers through the 'Messages' section of your dashboard. Select the provider you want to contact from your list of connections and start a new conversation.",
      isOpen: false
    },
    {
      question: "What should I do if I need emergency medical assistance?",
      answer: "If you need emergency medical assistance, please call your local emergency number (e.g., 911 in the US) immediately. CuraSync is not designed for emergency situations and should not replace emergency services.",
      isOpen: false
    }
  ]);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const toggleFAQ = (index: number) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index].isOpen = !updatedFaqs[index].isOpen;
    setFaqs(updatedFaqs);
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Contact form submitted:', contactForm);
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    // Show success message
    alert('Your message has been sent. We will get back to you soon!');
  };

  return (
    <div className="bg-white min-h-screen flex font-sans">
      <Sidebar />
      
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Help & Support</h1>
          
          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Send us an email and we'll respond within 24 hours</p>
              <a href="mailto:support@curasync.com" className="text-blue-600 hover:text-blue-800 font-medium">
                support@curasync.com
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Call us directly for immediate assistance</p>
              <a href="tel:+18001234567" className="text-green-600 hover:text-green-800 font-medium">
                +1 (800) 123-4567
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
              <button className="text-purple-600 hover:text-purple-800 font-medium">
                Start Chat
              </button>
            </div>
          </div>
          
          {/* FAQs */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
            <div className="flex items-center mb-6">
              <HelpCircle className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {faq.isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {faq.isOpen && (
                    <div className="p-4 bg-white">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* User Guides */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold">User Guides</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="#" className="p-4 border rounded-lg hover:bg-gray-50 flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Getting Started Guide</h3>
                  <p className="text-sm text-gray-600">Learn the basics of using CuraSync</p>
                </div>
              </a>
              
              <a href="#" className="p-4 border rounded-lg hover:bg-gray-50 flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Messaging Guide</h3>
                  <p className="text-sm text-gray-600">How to communicate with healthcare providers</p>
                </div>
              </a>
              
              <a href="#" className="p-4 border rounded-lg hover:bg-gray-50 flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Medical Records Guide</h3>
                  <p className="text-sm text-gray-600">Managing and sharing your medical information</p>
                </div>
              </a>
              
              <a href="#" className="p-4 border rounded-lg hover:bg-gray-50 flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Appointments Guide</h3>
                  <p className="text-sm text-gray-600">Scheduling and managing your appointments</p>
                </div>
              </a>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Mail className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold">Contact Us</h2>
            </div>
            
            <form onSubmit={handleContactFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleContactFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactFormChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;