"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HelpCircle, Search, MessageSquare, FileText, 
  Phone, Mail, Video, ExternalLink, ChevronRight, ChevronDown
} from 'lucide-react';
import DoctorSidebar from '@/components/doctor/Sidebar';
import { toast } from 'sonner';

const HelpSupportPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketCategory, setTicketCategory] = useState('general');
  const [ticketPriority, setTicketPriority] = useState('medium');

  // Sample FAQs
  const faqs = [
    {
      id: 1,
      question: "How do I add a new patient to my list?",
      answer: "You can add a new patient by going to the Patients tab and clicking on the 'Add New Patient' button. You can then search for patients by name or ID number and send them an invitation to connect."
    },
    {
      id: 2,
      question: "How do I schedule an appointment with a patient?",
      answer: "To schedule an appointment, navigate to the Patients tab, find the patient you want to schedule with, and click on the calendar icon. You can then select a date and time for the appointment and add any relevant notes."
    },
    {
      id: 3,
      question: "How do I view my patient's medical history?",
      answer: "You can view a patient's medical history by clicking on their name in the Patients tab, then selecting the 'Timeline' option. This will show you a chronological view of all their medical events, including appointments, lab results, and medications."
    },
    {
      id: 4,
      question: "How do I transfer a patient to another doctor?",
      answer: "To transfer a patient, go to the Patients tab, find the patient you want to transfer, and click on the transfer icon. You can then search for and select the doctor you want to transfer the patient to, add a reason for the transfer, and set the priority level."
    },
    {
      id: 5,
      question: "How do I update my profile information?",
      answer: "You can update your profile information by going to the Settings tab and selecting the Profile section. From there, you can edit your professional information, including your specialization, education, certifications, and availability."
    },
    {
      id: 6,
      question: "How do I change my notification preferences?",
      answer: "To change your notification preferences, go to the Settings tab and select the Notifications section. You can then toggle on/off different types of notifications, including email notifications, SMS notifications, appointment reminders, and patient messages."
    },
    {
      id: 7,
      question: "How do I enable two-factor authentication?",
      answer: "You can enable two-factor authentication by going to the Settings tab, selecting the Security section, and toggling on the 'Enable Two-Factor Authentication' option. You'll then be guided through the setup process to add an extra layer of security to your account."
    },
    {
      id: 8,
      question: "How do I message a patient?",
      answer: "To message a patient, go to the Messages tab and select the patient from your conversation list. If you don't see the patient in your list, you can start a new conversation by clicking on the 'New Message' button and searching for the patient by name."
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In a real app, you would send the ticket data to your backend
    toast.success("Support ticket submitted successfully");
    
    // Reset form
    setTicketSubject('');
    setTicketDescription('');
    setTicketCategory('general');
    setTicketPriority('medium');
  };

  const handleLiveChat = () => {
    toast.info("Connecting to a support agent...", {
      duration: 3000,
    });
    
    // Simulate connecting to chat
    setTimeout(() => {
      toast.success("Connected to support agent Sarah");
    }, 3000);
  };

  const handleVideoCall = () => {
    toast.info("Video support is currently unavailable. Please try again during business hours (9 AM - 5 PM).");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <DoctorSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
          <p className="text-gray-600 mb-8">Find answers to common questions or get in touch with our support team</p>
          
          {/* Search Bar */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search for help topics..."
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-6 h-6 text-gray-400 absolute left-4 top-3" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - FAQs */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Help Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
                  <p className="text-gray-600 text-sm mb-4">Browse our comprehensive documentation for detailed guides</p>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                    View Documentation
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Video className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                  <p className="text-gray-600 text-sm mb-4">Watch step-by-step video guides on how to use the platform</p>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                    Watch Tutorials
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Community Forum</h3>
                  <p className="text-gray-600 text-sm mb-4">Connect with other doctors and share experiences</p>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                    Join Discussion
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
              
              {/* FAQs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-500" />
                    Frequently Asked Questions
                  </h2>
                </div>
                
                {filteredFaqs.length === 0 ? (
                  <div className="p-8 text-center">
                    <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No FAQs found matching your search.</p>
                    <p className="text-gray-500 text-sm mt-2">Try a different search term or browse all FAQs.</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredFaqs.map((faq) => (
                      <div key={faq.id} className="px-6 py-4">
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full flex justify-between items-center text-left"
                        >
                          <h3 className="font-medium text-gray-900">{faq.question}</h3>
                          {expandedFaq === faq.id ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        
                        {expandedFaq === faq.id && (
                          <div className="mt-2 text-gray-600 bg-gray-50 p-4 rounded-md">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Video Tutorials */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Video className="w-5 h-5 mr-2 text-blue-500" />
                    Popular Video Tutorials
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  <div className="p-6 flex items-start">
                    <div className="w-32 h-20 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Getting Started with CuraSync</h3>
                      <p className="text-sm text-gray-500 mt-1">Learn the basics of navigating the doctor dashboard</p>
                      <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-2">
                        Watch Video (5:32)
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-6 flex items-start">
                    <div className="w-32 h-20 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Managing Patient Records</h3>
                      <p className="text-sm text-gray-500 mt-1">How to view, update, and organize patient information</p>
                      <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-2">
                        Watch Video (7:15)
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-6 flex items-start">
                    <div className="w-32 h-20 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Scheduling and Managing Appointments</h3>
                      <p className="text-sm text-gray-500 mt-1">Learn how to efficiently schedule and track appointments</p>
                      <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-2">
                        Watch Video (6:48)
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Contact & Support */}
            <div className="space-y-8">
              {/* Contact Options */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">Contact Support</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <button
                    onClick={handleLiveChat}
                    className="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="ml-3 text-left">
                      <span className="font-medium text-gray-800">Live Chat</span>
                      <p className="text-xs text-gray-500">Available 24/7</p>
                    </div>
                  </button>
                  
                  <a
                    href="mailto:support@curasync.com"
                    className="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="ml-3 text-left">
                      <span className="font-medium text-gray-800">Email Support</span>
                      <p className="text-xs text-gray-500">support@curasync.com</p>
                    </div>
                  </a>
                  
                  <a
                    href="tel:+18005551234"
                    className="w-full flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="ml-3 text-left">
                      <span className="font-medium text-gray-800">Phone Support</span>
                      <p className="text-xs text-gray-500">+1 (800) 555-1234</p>
                    </div>
                  </a>
                  
                  <button
                    onClick={handleVideoCall}
                    className="w-full flex items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="ml-3 text-left">
                      <span className="font-medium text-gray-800">Video Support</span>
                      <p className="text-xs text-gray-500">9 AM - 5 PM (Mon-Fri)</p>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Submit Ticket */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">Submit a Support Ticket</h2>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing Question</option>
                        <option value="feature">Feature Request</option>
                        <option value="account">Account Management</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={ticketPriority}
                        onChange={(e) => setTicketPriority(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Please describe your issue in detail..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Submit Ticket
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Support Hours */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">Support Hours</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 8:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium">10:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Live chat support is available 24/7. For urgent issues outside of business hours, please use the live chat option.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HelpSupportPage;