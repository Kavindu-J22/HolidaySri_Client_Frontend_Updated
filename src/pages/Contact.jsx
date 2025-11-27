import React, { useState } from 'react';
import SEO from '../components/SEO/SEO';
import { getFAQSchema } from '../utils/seoUtils';
import {
  Search,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  MapPin,
  Send,
  HelpCircle,
  BookOpen,
  CreditCard,
  Shield,
  Users,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Headphones,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Loader
} from 'lucide-react';

const Contact = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick help categories
  const helpCategories = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Learn how to use HolidaySri',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      link: '/help/getting-started'
    },
    {
      icon: CreditCard,
      title: 'HSC & Payments',
      description: 'Manage your wallet & transactions',
      color: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      link: '/hsc'
    },
    {
      icon: Shield,
      title: 'Account & Security',
      description: 'Protect your account',
      color: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      link: '/profile'
    },
    {
      icon: Users,
      title: 'For Advertisers',
      description: 'Post & manage advertisements',
      color: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      link: '/post-advertisement'
    }
  ];

  // FAQ data
  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'What is HolidaySri?',
          a: 'HolidaySri is Sri Lanka\'s premier travel and tourism platform connecting travelers with authentic local experiences, accommodations, tours, and services across the island.'
        },
        {
          q: 'How do I create an account?',
          a: 'Click on the "Register" button in the top right corner, fill in your details, and verify your email address. You can also sign up using your Google account for faster registration.'
        },
        {
          q: 'Is HolidaySri free to use?',
          a: 'Yes! Browsing and searching for services is completely free. Service providers can choose from various membership plans to advertise their offerings.'
        }
      ]
    },
    {
      category: 'HSC Tokens',
      questions: [
        {
          q: 'What are HSC tokens?',
          a: 'HSC (HolidaySri Coins) are our platform\'s reward tokens. Earn them through activities like reviews, referrals, and engagement. Use them for discounts and premium features.'
        },
        {
          q: 'How can I earn HSC tokens?',
          a: 'Earn HSC by writing reviews, referring friends, completing your profile, booking services, and participating in platform activities. Check your wallet for earning opportunities.'
        },
        {
          q: 'Can I convert HSC to cash?',
          a: 'HSC tokens can be used for discounts on bookings, premium memberships, and special offers within the platform. Direct cash conversion is not available.'
        }
      ]
    },
    {
      category: 'Bookings & Payments',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept credit/debit cards (Visa, Mastercard), PayHere, and HSC tokens. All transactions are secured with industry-standard encryption.'
        },
        {
          q: 'How do I cancel a booking?',
          a: 'Go to your Profile Dashboard, select "My Bookings", find your booking, and click "Cancel". Refund policies vary by service provider and are shown before booking.'
        },
        {
          q: 'When will I receive my refund?',
          a: 'Refunds are processed within 5-7 business days to your original payment method, subject to the service provider\'s cancellation policy.'
        }
      ]
    },
    {
      category: 'For Service Providers',
      questions: [
        {
          q: 'How do I list my service?',
          a: 'Register as a service provider, complete your profile verification, choose a membership plan, and post your advertisement through the "Post Advertisement" section.'
        },
        {
          q: 'What are the membership benefits?',
          a: 'Membership plans offer features like priority listing, featured ads, analytics, unlimited photos, and reduced commission rates. Visit our Membership page for details.'
        },
        {
          q: 'How do I receive payments?',
          a: 'Payments are processed through our secure system and transferred to your registered bank account within 3-5 business days after service completion.'
        }
      ]
    }
  ];

  // Contact methods
  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      value: '+94 11 234 5678',
      description: 'Mon-Sat, 9:00 AM - 6:00 PM',
      action: 'tel:+94112345678',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '+94 77 123 4567',
      description: 'Quick responses 24/7',
      action: 'https://wa.me/94771234567',
      color: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Mail,
      title: 'Email Support',
      value: 'support@holidaysri.com',
      description: 'Response within 24 hours',
      action: 'mailto:support@holidaysri.com',
      color: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Headphones,
      title: 'Live Chat',
      value: 'Chat with us',
      description: 'Available during business hours',
      action: '#',
      color: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus({ type: 'error', message: 'Please fill in all required fields' });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({ type: 'error', message: 'Please enter a valid email address' });
      setIsSubmitting(false);
      return;
    }

    try {
      // Call backend API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://holidaysri-backend-9xm4.onrender.com'}/api/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setFormStatus({
        type: 'success',
        message: data.message || 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form error:', error);
      setFormStatus({
        type: 'error',
        message: error.message || 'Failed to send message. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq =>
      searchQuery === '' ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  // Prepare FAQ structured data
  const faqStructuredData = getFAQSchema(
    faqs.flatMap(category =>
      category.questions.map(q => ({
        question: q.q,
        answer: q.a
      }))
    )
  );

  return (
    <>
      <SEO
        title="Contact Us | Holidaysri - Get Help & Support for Sri Lanka Travel"
        description="Need help planning your Sri Lanka trip? Contact Holidaysri support team for assistance with bookings, services, and travel information. We're here to help 24/7."
        keywords="contact Holidaysri, Sri Lanka travel support, customer service, help center, travel assistance Sri Lanka, contact tourism platform"
        canonical="https://www.holidaysri.com/contact"
        structuredData={faqStructuredData}
      />
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            HolidaySri Support Center
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            How can we help you today? Search for answers or get in touch with our support team
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Quick Help
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {helpCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <a
                key={index}
                href={category.link}
                className={`${category.color} rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700`}
              >
                <Icon className={`w-10 h-10 ${category.iconColor} mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      {/* Contact Methods */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Get In Touch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <a
                key={index}
                href={method.action}
                target={method.action.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`${method.color} rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 text-center`}
              >
                <Icon className={`w-12 h-12 ${method.iconColor} mx-auto mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {method.title}
                </h3>
                <p className={`font-medium ${method.iconColor} mb-1`}>
                  {method.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {method.description}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.category}
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = `${categoryIndex}-${faqIndex}`;
                  const isExpanded = expandedFaq === globalIndex;
                  return (
                    <div key={faqIndex}>
                      <button
                        onClick={() => toggleFaq(globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="text-left font-medium text-gray-900 dark:text-white pr-4">
                          {faq.q}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredFaqs.length === 0 && searchQuery && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No FAQs found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Send className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Send Us a Message
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Can't find what you're looking for? Fill out the form below and we'll get back to you soon
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="+94 77 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a category</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="account">Account Issues</option>
                  <option value="advertising">Advertising</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Brief description of your inquiry"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Please provide as much detail as possible..."
                required
              ></textarea>
            </div>

            {formStatus.message && (
              <div className={`p-4 rounded-lg flex items-start space-x-3 ${
                formStatus.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                {formStatus.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <p className={formStatus.type === 'success'
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
                }>
                  {formStatus.message}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Additional Info */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Office Hours */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <Clock className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Support Hours
          </h3>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
            <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
            <p><strong>Sunday:</strong> Closed</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
              * WhatsApp support available 24/7
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <MapPin className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Our Office
          </h3>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>Holidaysri PVT LTD</p>
            <p>123 Galle Road</p>
            <p>Colombo 03, Sri Lanka</p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline mt-2"
            >
              <Globe className="w-4 h-4 mr-1" />
              View on Map
            </a>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl p-6 border border-pink-200 dark:border-pink-800">
          <Users className="w-10 h-10 text-pink-600 dark:text-pink-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Follow Us
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Stay connected on social media for updates and travel inspiration
          </p>
          <div className="flex space-x-3">
            <a
              href="https://facebook.com/holidaysri"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </a>
            <a
              href="https://twitter.com/holidaysri"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
            >
              <Twitter className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </a>
            <a
              href="https://instagram.com/holidaysri"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
            >
              <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </a>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border-2 border-red-200 dark:border-red-800">
        <div className="flex items-start space-x-4">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Emergency Support
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              For urgent matters requiring immediate assistance (safety concerns, payment issues, account security):
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+94112345678"
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Emergency Line
              </a>
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Emergency
              </a>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Contact;
