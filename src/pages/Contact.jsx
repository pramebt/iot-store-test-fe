export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-semibold mb-6 text-gray-900">Contact Us</h1>
        <p className="text-xl text-gray-500 leading-relaxed mb-8">
          Get in touch with us. We'd love to hear from you.
        </p>
        <div className="bg-gray-50 rounded-2xl p-8 text-left">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
              <p className="text-lg text-gray-900">info@iotstore.com</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
              <p className="text-lg text-gray-900">+66 12 345 6789</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
              <p className="text-lg text-gray-900">123 Business St., Bangkok, Thailand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
