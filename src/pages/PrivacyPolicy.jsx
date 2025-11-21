import { Shield, Mail, Phone, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy <span className="text-primary-600">Policy</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Privacy Policy for Holidaysri Pvt Ltd
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Last updated: 18th June 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              At Holidaysri.com Pvt Ltd (referred to as "Holidaysri", "we", "our", or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you visit our website www.holidaysri.com or use our services. By accessing our website or using our services, you agree to the terms outlined in this Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Information We Collect
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              When you interact with Holidaysri, we may collect and process the following types of information:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              Personal Information
            </h3>

            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>
                <strong>Contact Information:</strong> Includes your name, email address, phone number, and postal address. We collect this information when you book tours, register for an account, or subscribe to our newsletters.
              </li>
              <li>
                <strong>Payment Information:</strong> Includes credit or debit card details and billing information. Payment transactions are securely processed by our trusted third-party payment processors.
              </li>
              <li>
                <strong>Booking Information:</strong> Details of your travel arrangements and preferences, such as tour selections, travel dates, and special requirements.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              Automatically Collected Information
            </h3>

            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>
                <strong>Browsing Information:</strong> Information about your visits to our website, including your IP address, browser type, operating system, and pages viewed. This data is collected through cookies and similar tracking technologies.
              </li>
              <li>
                <strong>Device Information:</strong> Information about the device you use to access our website, including device type, operating system, and mobile network information.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              How We Use Your Information
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use the information we collect to:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>
                <strong>Process and Manage Bookings:</strong> To facilitate your bookings, manage your reservations, and provide you with the services you request.
              </li>
              <li>
                <strong>Communicate with You:</strong> To send booking confirmations, updates, customer service responses, and promotional offers that may interest you.
              </li>
              <li>
                <strong>Personalize Your Experience:</strong> To customize the content and offers presented to you based on your preferences and browsing history.
              </li>
              <li>
                <strong>Improve Our Services:</strong> To analyze how our website is used, improve our offerings, and enhance user experience.
              </li>
              <li>
                <strong>Ensure Security:</strong> To detect and prevent fraud, unauthorized activities, and to protect our website and services.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Information Sharing and Disclosure
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>
                <strong>Trusted Service Providers:</strong> We may share your information with third-party service providers who assist us in operating our website, processing payments, and delivering services. These providers are contractually obligated to protect your information and use it solely for the purposes specified by us.
              </li>
              <li>
                <strong>Legal Compliance:</strong> We may disclose your information if required to do so by law or in response to valid legal processes, such as a court order or subpoena.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Data Security
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We employ industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. While we strive to use commercially acceptable means to protect your information, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Cookies and Tracking Technologies
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Our website uses cookies and similar tracking technologies to enhance your browsing experience, gather analytical data, and provide personalized content. You can manage your cookie preferences through your browser settings. Please note that disabling cookies may limit the functionality of our website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Third-Party Links
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Our website may contain links to external websites or services that are not operated by us. We are not responsible for the privacy practices or content of these third-party websites. We encourage you to review their privacy policies before providing any personal information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Data Retention
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. We may update or modify this Privacy Policy from time to time. Any changes will be posted on this page with an updated "last updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we collect, use, and protect your information.
            </p>

            {/* Contact Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact us at:
              </p>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Holidaysri.com Pvt Ltd
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <a
                      href="mailto:holidaysri7@gmail.com"
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      holidaysri7@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <Globe className="w-5 h-5 text-primary-600" />
                    <a
                      href="https://holidaysri.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      www.holidaysri.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <span>+94 76 534 5234</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mt-6">
                By using our website, you consent to the terms of this Privacy Policy. Please review this Privacy Policy periodically for any updates or changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

