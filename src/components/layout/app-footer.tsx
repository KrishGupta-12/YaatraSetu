
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { YaatraSetuLogo } from "@/components/icons";

export function AppFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <YaatraSetuLogo className="h-6 w-6" />
              YaatraSetu
            </h3>
            <p className="text-sm text-gray-400">
              Your complete Bharatiya travel companion.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/features" className="text-gray-400 hover:text-white">
                Features
              </Link>
               <Link href="/founder" className="text-gray-400 hover:text-white">
                Founder
              </Link>
              <Link href="/auth/login" className="text-gray-400 hover:text-white">
                Login
              </Link>
              <Link href="/auth/signup" className="text-gray-400 hover:text-white">
                Signup
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/help-center" className="text-gray-400 hover:text-white">
                Help Center
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact Us
              </Link>
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
            </nav>
          </div>
          <div className="col-span-2 md:col-span-2">
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex items-center gap-4">
              <Link href="https://x.com/KRISH_200510?t=RdG7ZYGR-XG1RsEXmw9kwA&s=09" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
              <Link href="https://www.facebook.com/krish.gupta.940641?mibextid=ZbWKwL" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
              <Link href="https://www.instagram.com/krishgupta200510?igsh=MWxtN2toaHc4c2Fucg==" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
               <Link href="https://www.linkedin.com/in/krish-gupta-11612327a/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} YaatraSetu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
