import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 pt-10 pb-6 border-t flex flex-col items-center">
      <div className="w-[80%] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="col-span-2">
          <div className="flex items-center mb-4">
            <Image
              src="/assets/logo/LogoFooter.png"
              alt="Agrowtify Logo"
              className="mr-2"
              width={250}
              height={20}
            />
          </div>
          <p className="text-sm mb-6 text-gray-700">
            <b>Agrowtify</b> hadir untuk menemani perjalanan pertanian anda.
            Jadikan setiap langkah anda di lahan lebih terarah, terukur, dan
            berdaya guna!
          </p>
          <div className="flex space-x-4">
            <Link href="#">
              <FaInstagram size={24} className="text-green-800" />
            </Link>
            <Link href="#">
              <FaTiktok size={24} className="text-green-800" />
            </Link>
            <Link href="#">
              <FaYoutube size={24} className="text-green-800" />
            </Link>
            <Link href="#">
              <FaLinkedin size={24} className="text-green-800" />
            </Link>
            <Link href="#">
              <FaEnvelope size={24} className="text-green-800" />
            </Link>
          </div>
        </div>

        <div className="text-primary-400">
          <h4 className="text-lg font-bold mb-4">Fitur Utama</h4>
          <ul className="flex flex-col gap-3 font-medium">
            <li>
              <a href="#">Agrowguide</a>
            </li>
            <li>
              <a href="#">Agrowvent</a>
            </li>
            <li>
              <a href="#">Agrowcare</a>
            </li>
          </ul>
        </div>

        <div className="text-primary-400">
          <h4 className="text-lg font-semibold mb-4">Kontak</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center mb-2">
              <FaEnvelope size={20} className="mr-2" />
              <span>agrowtify@gmail.com</span>
            </div>
            <div className="flex items-center">
              <FaPhone size={20} className="mr-2" />
              <span>+62-812-3456-7890</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600 w-[80%] pt-8 border-t-4 border-black">
        &copy; Copyright 2025. Team Agrowtify. All Rights Reserved
      </div>
    </footer>
  );
}
