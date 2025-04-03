// src/pages/Home/components/Footer.tsx
import { Link } from "react-router-dom";

import { Logo } from "@/components/logo";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Logo size="lg" />
            <p className="text-primary-foreground/70 max-w-md mt-4">
              Making travel planning collaborative, cultural, and connected.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-primary-foreground/70 hover:text-primary-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-primary-foreground/70 hover:text-primary-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-primary-foreground/70 hover:text-primary-foreground"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-primary-foreground/70 hover:text-primary-foreground"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-primary-foreground/70 hover:text-primary-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-primary-foreground/70 hover:text-primary-foreground"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-primary-foreground/70 hover:text-primary-foreground"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-primary-foreground/70 hover:text-primary-foreground"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookies"
                    className="text-primary-foreground/70 hover:text-primary-foreground"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/70">
          <p>
            © {new Date().getFullYear()} TravelTogether. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
