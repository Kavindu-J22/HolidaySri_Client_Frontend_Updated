import { FileText, Mail, Phone, Globe } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms & <span className="text-primary-600">Conditions</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Terms and Conditions for Holidaysri Pvt Ltd
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Welcome to Holidaysri Pvt Ltd (referred to as "Holidaysri", "we", "our", or "us"). These Terms and Conditions outline the rules and regulations for using our website and the terms of purchasing our travel services. By accessing or using www.holidaysri.com, you agree to comply with these terms. Please read them carefully before proceeding with any bookings or transactions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Use of the Website
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">a. Eligibility:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  You must be at least 18 years old to use our website or make bookings. By accessing or using our services, you confirm that you meet this age requirement.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">b. Account Security:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  You are responsible for maintaining the confidentiality of your account information, including your username and password. Any activity under your account is your responsibility.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">c. Information Accuracy:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  You agree to provide accurate and up-to-date information during the registration and booking process. This includes personal details, payment information, and travel preferences.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">d. Prohibited Activities:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  You may not use our website for any unlawful or unauthorized purposes. This includes but is not limited to the misuse of our services or engaging in activities that could harm our website or reputation.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Travel Services and Pricing
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">a. Service Descriptions:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  We strive to provide accurate descriptions, images, and details of our travel services and packages. However, we do not guarantee the completeness or accuracy of this information. Travel itineraries and services are subject to change based on availability and conditions.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">b. Pricing:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Prices for tours and services are subject to change without notice. Any promotions or discounts are valid for a limited time and may have specific terms and conditions.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">c. Inclusions and Exclusions:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Our service descriptions specify what is included in your purchase. Additional costs, such as optional activities, personal expenses, and travel insurance, are typically not included unless stated otherwise.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Bookings and Payments
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">a. Booking Confirmation:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  By placing a booking on our website, you make an offer to purchase the selected travel services. Your booking is confirmed only when we issue a booking confirmation.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">b. Right to Refuse:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  We reserve the right to refuse or cancel any booking for any reason. This includes but is not limited to, availability, pricing errors, or suspected fraudulent activity.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">c. Payment Terms:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  You agree to provide valid and up-to-date payment information and authorize us to charge the total booking amount, including applicable taxes and fees, to your chosen payment method.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">d. Secure Payments:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  We use trusted third-party payment processors to handle your payment information securely. We do not store or have access to your full payment details.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Cancellations, Returns, and Refunds
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">a. Cancellation Policy:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Our Refund Policy outlines the conditions and procedures for cancelling bookings and obtaining refunds. Please refer to this policy for detailed information.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">b. Non-Refundable Services:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Certain services and bookings are non-refundable or subject to specific cancellation terms. Please review the service details and our Refund Policy carefully before booking.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Shipping and Delivery (For Physical Merchandise)
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">a. Shipping Information:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  We will make reasonable efforts to ship and deliver any physical merchandise purchased from our website in a timely manner.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">b. Delivery Estimates:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Shipping and delivery times are estimates and may vary depending on your location and other factors. Holidaysri is not responsible for delays beyond our control.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Intellectual Property
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">a. Content Ownership:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  All content and materials on our website, including text, images, logos, and graphics, are protected by intellectual property rights and are the property of Holidaysri or our licensors.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">b. Usage Restrictions:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  You may not use, reproduce, distribute, or modify any content from our website without our prior written consent. Unauthorized use of our content is prohibited.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Limitation of Liability
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">a. No Liability for Indirect Damages:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Holidaysri, its directors, employees, or affiliates will not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of our website or the purchase and use of our services.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">b. Service Warranties:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  We make no warranties or representations, express or implied, regarding the quality, accuracy, or suitability of the travel services offered on our website. All services are provided "as is".
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Amendments and Termination
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">a. Policy Updates:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  We reserve the right to modify, update, or terminate these Terms and Conditions at any time without prior notice. It is your responsibility to review these terms periodically for any changes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">b. Termination of Access:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  We may terminate or suspend your access to our website and services without prior notice if we believe you have violated these Terms and Conditions or engaged in harmful conduct.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Governing Law
            </h2>

            <p className="text-gray-700 dark:text-gray-300">
              These Terms and Conditions are governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising out of or related to these terms will be resolved in the courts of Sri Lanka.
            </p>

            {/* Contact Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                If you have any questions or concerns regarding these Terms and Conditions, please contact us at:
              </p>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Holidaysri Pvt Ltd
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
                By using our website and services, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
