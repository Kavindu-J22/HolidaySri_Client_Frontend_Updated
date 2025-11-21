import { FileText, Mail, Phone, Globe } from 'lucide-react';

const RefundPolicy = () => {

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
            Refund <span className="text-primary-600">Policy</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Refund Policy for Holidaysri Pvt Ltd
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Thank you for booking with Holidaysri Pvt Ltd. Your satisfaction is our top priority, and we aim to provide you with an exceptional travel experience. If you need to cancel or make changes to your booking, our Refund Policy below outlines the steps and conditions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Cancellation and Refunds
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              Tours and Packages:
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Cancellation by Customer:</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>30 Days or More Before Departure:</strong> Full refund minus a 10% administration fee.</li>
                  <li><strong>15 to 29 Days Before Departure:</strong> 50% refund of the total booking amount.</li>
                  <li><strong>14 Days or Less Before Departure:</strong> No refund.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Cancellation by Holidaysri:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  In rare cases where we must cancel a tour or service due to unforeseen circumstances, you will receive a full refund or the option to reschedule your tour.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Refund Processing:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Once we receive your cancellation request, we will process your refund within 7-10 business days. The refunded amount will be credited back to your original method of payment. Please note that your bank or payment provider may take additional time to reflect the refund in your account.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Special Considerations
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Non-Refundable Items:</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Certain services and items are non-refundable once booked or purchased. These include:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Flight tickets and related fees</li>
                  <li>Personalized or custom itineraries</li>
                  <li>Non-refundable hotel reservations</li>
                  <li>Event tickets</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Partially Used Services:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  If you have used part of the service or tour, we will only refund the unused portion, provided that the conditions for partial refunds are met and detailed in the service terms.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Changes and Exchanges
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Modifying Your Booking:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  If you need to change your tour dates or make other modifications to your booking, please contact us at least 30 days before the scheduled departure. Changes are subject to availability and may incur additional fees.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Exchanging Services:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  You may exchange your tour or service for another of equal or greater value (subject to additional payment) if the request is made at least 30 days before the original departure date.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Damaged or Defective Services
            </h2>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Service Issues:</h4>
              <p className="text-gray-700 dark:text-gray-300">
                If you encounter any problems or issues with your tour or service, please contact us immediately. We will work to resolve the issue, which may include a replacement service or a refund, depending on availability and the nature of the issue.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Return Shipping for Physical Products
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Returning Merchandise:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  For physical items such as travel kits or merchandise purchased from our website, you are responsible for the return shipping costs unless the item is defective or the wrong item was shipped. In such cases, we will provide a prepaid shipping label.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Condition of Returned Items:</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  To be eligible for a refund, returned items must be unused, in their original packaging, and in the same condition as received.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Refund and Exchange Processing Time
            </h2>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Processing Time:</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Refunds and exchanges will be processed within 7-10 business days after we receive and verify your request or returned item. The time taken for the refund to appear in your account will depend on your payment provider.
              </p>
            </div>

            {/* Contact Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                If you have any questions or concerns about our Refund Policy, please contact our customer support team. We are here to assist you and ensure that your experience with Holidaysri is smooth and enjoyable.
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
