import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function Contact() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <PageHeader 
          title="Contact Us"
          subtitle="Get in touch with us. We'd love to hear from you."
        />
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left shadow-sm">
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
    </PageContainer>
  );
}
