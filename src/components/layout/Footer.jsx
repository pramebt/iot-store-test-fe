import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <h3 className="text-base font-medium mb-4 text-gray-900">IoT Store</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              แหล่งรวมอุปกรณ์ IoT และอิเล็กทรอนิกส์คุณภาพสูงที่คุณไว้วางใจ 
              เรามีโซลูชันนวัตกรรมสำหรับบ้านอัจฉริยะและความต้องการทางธุรกิจของคุณ
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-gray-900">ลิงก์ด่วน</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                  สินค้า
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-gray-900">บริการลูกค้า</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/orders" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                  ออเดอร์ของฉัน
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                  บัญชีของฉัน
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                  นโยบายการจัดส่ง
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                  นโยบายการคืนสินค้า
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-gray-900">ติดต่อเรา</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-gray-500 text-sm">
                  123 ถนนธุรกิจ แขวงบางรัก เขตบางรัก กรุงเทพมหานคร 10500
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <a href="tel:+66123456789" className="text-gray-500 hover:text-gray-900 text-sm">
                  +66 12 345 6789
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <a href="mailto:info@iotstore.com" className="text-gray-500 hover:text-gray-900 text-sm">
                  info@iotstore.com
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-xs">
            &copy; {currentYear} IoT Store สงวนลิขสิทธิ์
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
