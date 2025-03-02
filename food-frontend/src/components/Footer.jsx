import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-12 px-6">
      <div className="container mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Quick Links */}
        <div>
          <Typography variant="h6" className="mb-4 font-semibold">
            Quick Links
          </Typography>
          <ul className="space-y-2">
            <li>
              <Link href="/restaurant" className="text-gray-400 hover:text-white">
                Restaurants
              </Link>
            </li>
            <li>
              <Link href="/special" className="text-gray-400 hover:text-white">
                Special Offers
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="text-gray-400 hover:text-white">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <Typography variant="h6" className="mb-4 font-semibold">
            Customer Support
          </Typography>
          <p className="text-gray-400">Need help? Contact us at:</p>
          <p className="text-gray-400">support@foodfetch.com</p>
          <p className="text-gray-400">+1 (800) 123-4567</p>
        </div>

        {/* Social Media */}
        <div>
          <Typography variant="h6" className="mb-4 font-semibold">
            Follow Us
          </Typography>
          <div className="flex justify-center md:justify-start gap-4">
            <motion.a whileHover={{ scale: 1.1 }} href="#" className="text-gray-400 hover:text-white">
              <FaFacebook size={24} />
            </motion.a>
            <motion.a whileHover={{ scale: 1.1 }} href="#" className="text-gray-400 hover:text-white">
              <FaInstagram size={24} />
            </motion.a>
            <motion.a whileHover={{ scale: 1.1 }} href="#" className="text-gray-400 hover:text-white">
              <FaTwitter size={24} />
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
