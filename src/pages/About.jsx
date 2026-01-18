import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';
import { motion } from 'framer-motion';
import { Target, Users, Award, Heart } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'วิสัยทัศน์',
      description: 'เป็นผู้นำในการจำหน่ายอุปกรณ์ IoT และสินค้าคุณภาพสูง พร้อมให้บริการที่ครบวงจร',
    },
    {
      icon: Users,
      title: 'พันธกิจ',
      description: 'มุ่งมั่นให้ลูกค้าได้รับสินค้าคุณภาพ บริการที่ดี และประสบการณ์การซื้อที่ยอดเยี่ยม',
    },
    {
      icon: Award,
      title: 'คุณภาพ',
      description: 'คัดสรรสินค้าคุณภาพสูงจากแบรนด์ที่เชื่อถือได้ พร้อมรับประกันและบริการหลังการขาย',
    },
    {
      icon: Heart,
      title: 'ความมุ่งมั่น',
      description: 'ใส่ใจในทุกรายละเอียด เพื่อให้ลูกค้าพึงพอใจสูงสุดในทุกการซื้อสินค้า',
    },
  ];

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto">
        <PageHeader 
          title="เกี่ยวกับเรา"
          subtitle="IoT Store - ร้านค้าออนไลน์สำหรับอุปกรณ์ IoT และสินค้าคุณภาพ"
        />

        {/* Main Content */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl mx-auto">
            IoT Store เป็นร้านค้าออนไลน์ที่เชี่ยวชาญในการจำหน่ายอุปกรณ์ IoT และสินค้าอิเล็กทรอนิกส์คุณภาพสูง 
            เรามุ่งมั่นให้บริการที่ครบวงจร ตั้งแต่การเลือกซื้อสินค้า การติดตั้ง ไปจนถึงการดูแลหลังการขาย
          </p>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            ด้วยทีมงานที่มีประสบการณ์และความเชี่ยวชาญ เราพร้อมให้คำปรึกษาและบริการที่ดีที่สุด 
            เพื่อให้คุณได้รับสินค้าที่ตรงตามความต้องการและใช้งานได้อย่างมีประสิทธิภาพ
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Services Section */}
        <motion.div
          className="bg-gray-50 rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">บริการของเรา</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">จำหน่ายสินค้า</h3>
              <p className="text-gray-600 text-sm">
                อุปกรณ์ IoT และสินค้าอิเล็กทรอนิกส์คุณภาพสูงจากแบรนด์ชั้นนำ
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">บริการติดตั้ง</h3>
              <p className="text-gray-600 text-sm">
                บริการติดตั้งและตั้งค่าอุปกรณ์ IoT โดยทีมงานผู้เชี่ยวชาญ
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">ดูแลหลังการขาย</h3>
              <p className="text-gray-600 text-sm">
                บริการซ่อมแซม รับประกัน และให้คำปรึกษาหลังการขาย
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
