import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';

export default function About() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto text-center">
        <PageHeader 
          title="About Us"
          subtitle="Learn more about IoT Store"
        />
        <p className="text-xl text-gray-500 leading-relaxed">
          We're building something amazing. Stay tuned for more information about IoT Store.
        </p>
      </div>
    </PageContainer>
  );
}
