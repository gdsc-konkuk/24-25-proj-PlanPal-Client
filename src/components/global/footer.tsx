"use client";

import Link from "next/link";
import { Logo } from "../logo";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Logo size="lg" rounded={true} />
            <p className="text-primary-foreground/70 mt-4">
              <strong className="text-primary-foreground">Talking</strong> with{" "}
              <strong className="text-primary-foreground">Map</strong>, and just{" "}
              <strong className="text-primary-foreground">Go travel</strong>.
            </p>
            <p className="text-primary-foreground/70 max-w-md mt-2">
              Making travel planning collaborative, cultural, and connected.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://github.com/gdsc-konkuk/24-25-proj-PlanPal-Client"
                    className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer"
                  >
                    Feature - Frontend
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/gdsc-konkuk/24-25-proj-PlanPal-Server"
                    className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer"
                  >
                    Feature - Backend
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/gdsc-konkuk/24-25-proj-PlanPal-Chat"
                    className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer"
                  >
                    Feature - AI
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Team</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://github.com/gdsc-konkuk"
                    className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://gdg.community.dev/gdg-on-campus-konkuk-university-seoul-south-korea/"
                    className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer"
                  >
                    GDGoC Konkuk
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.linkedin.com/company/gdgoc-konkuk/"
                    className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer"
                  >
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
            {/* <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>

        {/* copyright */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/70">
          <p>
            © {new Date().getFullYear()} Google Developer Groups on Campus
            Konkuk. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <span>Made by</span>
            <span className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link
                href="https://github.com/MinboyKim"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary-foreground"
              >
                <span>Dongmin Kim</span>
              </Link>
              <Link
                href="https://github.com/Turtle-Hwan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary-foreground"
              >
                <span>Jihwan Kim</span>
              </Link>
              <Link
                href="https://github.com/yunuo46"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary-foreground"
              >
                <span>Hyunwoo Song</span>
              </Link>
              <Link
                href="https://github.com/drbug2000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary-foreground"
              >
                <span>Sangjune Kim</span>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
