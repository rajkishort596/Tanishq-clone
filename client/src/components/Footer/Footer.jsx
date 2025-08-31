import React from "react";
import { useFooter } from "../../hooks/useFooter";
import { Facebook, Instagram, Youtube, Twitter, Mail } from "lucide-react";
import Spinner from "../Spinner";

const Footer = () => {
  const { storeInfo, contactInfo, socialLinks, isLoading, error } = useFooter();

  if (isLoading)
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <p className="text-center py-4 text-red-500">Failed to load footer</p>
    );

  return (
    <footer className="bg-[#300708] relative text-white px-12 lg:px-20 py-15 rounded-2xl font-fraunces">
      <img
        className="hidden md:block absolute top-0 left-1/2 h-6 transform -translate-x-1/2"
        src="https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw20a12c74/images/footer/top-bottom-border-curve.png"
        alt="Border Curve Icon"
      ></img>
      <img
        className="hidden md:block absolute bottom-0 left-1/2 h-6 transform rotate-180 -translate-x-1/2"
        src="https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw20a12c74/images/footer/top-bottom-border-curve.png"
        alt="Border Curve Icon"
      ></img>
      {/* Logo*/}
      <div className="flex lg:mx-5 lg:mb-5 mb-4">
        <img
          src="/WhiteLogo.svg"
          alt="Tanishq"
          className=" h-12 sm:h-20 mb-4"
        />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Tanishq QR */}
        <div className="hidden md:flex flex-col lg:items-center">
          <p className="mb-3 text-xl font-normal lg:text-center">
            Download the Tanishq App Now
          </p>
          <img src="/QR-code.svg" alt="QR Code" className="h-40 w-40 mb-4" />
          <div className="flex space-x-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.titancompany.tanishqapp&pli=1#cm_sp=Homepage-_-footer-_-AndroidAppLogo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/playstore.svg" alt="Play Store" className="h-10" />
            </a>
            <a
              href="https://apps.apple.com/in/app/tanishq-a-tata-product/id1494086207#cm_sp=Homepage-_-footer-_-IOSApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/appstore.svg" alt="App Store" className="h-10" />
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="font-normal text-xl mb-4">Useful Links</h4>
          <ul className="space-y-2 text-sm">
            <ul className="space-y-2 text-sm font-IBM-Plex font-light">
              <li>
                <a href="#" className="hover:text-gray-300 ">
                  Delivery Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  International Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Payment Options
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Track Your Orders
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Returns
                </a>
              </li>
            </ul>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 className="font-normal text-xl mb-4">Information</h4>
          <ul className="space-y-2 text-sm font-IBM-Plex font-light">
            <li>
              <a href="#" className="hover:text-gray-300 ">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Help & FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                About Tanishq
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-normal text-xl mb-4">Contact Us</h4>
          <p className="flex items-center gap-2 text-sm">
            +91 {contactInfo?.phones?.[0]}
          </p>
          <h4 className="font-semibold text-lg mt-4 mb-2">Chat With Us</h4>
          <p className="text-sm mb-3 font-light  pb-4 border-b inline-block border-white">
            +91 {contactInfo?.whatsapp}
          </p>
          <div className="flex space-x-4 text-xl pt-4">
            <a
              href={`https://wa.me/${contactInfo?.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/whatsapp.svg" className="w-5" />
            </a>
            <a
              href={`mailto:${contactInfo?.emails?.[0]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Social + Bottom */}
      <div className="border-t border-[#ffffff4d] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
        {/* Social */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0 lg:mx-5">
          <span className="font-medium font-IBM-Plex">Social</span>

          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#452021] rounded-full p-1.5 flex justify-center items-center"
          >
            <Facebook size={20} strokeWidth={1} />
          </a>
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#452021] rounded-full p-1.5 flex justify-center items-center"
          >
            <Instagram size={20} strokeWidth={1} />
          </a>
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#452021] rounded-full p-1.5 flex justify-center items-center"
          >
            <Youtube size={20} strokeWidth={1} />
          </a>
          <a
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#452021] rounded-full p-1.5 flex justify-center items-center"
          >
            <Twitter size={20} strokeWidth={1} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-white font-light font-IBM-Plex text-xs text-center md:text-right">
          © {new Date().getFullYear()} Titan Company Limited. All Rights
          Reserved.
        </p>
      </div>

      {/* Bottom Links */}
      <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs mt-4 font-light font-IBM-Plex text-white">
        <a href="/terms">Terms & Conditions</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/disclaimer">Disclaimer</a>
      </div>
    </footer>
  );
};

export default Footer;
