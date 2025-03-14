"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import k7logo from "@/assets/k7logo2.png";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../language-switcher";

export default function NavHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("HomePage");

  const menuItems = [
    { id: "home", label: t("sections.home") },
    { id: "features", label: t("sections.features") },
    { id: "about-us", label: t("sections.aboutUs") },
    { id: "contact", label: t("sections.contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > window.innerHeight * 0.8;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full mx-auto transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-slate-900 to-slate-700"
          : "bg-transparent"
      }`}
    >
      <nav
        className={`container mx-auto px-2 md:px-6 py-2 ${
          isRTL ? "font-notoNaskhArabic" : "font-poppins"
        }`}
      >
        <div
          className="flex justify-between items-center"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Mobile Menu Button - Only visible on mobile */}
          <div className="flex items-center gap-2">
          <Sheet  open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Menu className="h-8 w-8 text-white" />
            </SheetTrigger>
            <SheetContent className="bg-slate-900 text-gray-200" side="left">
              <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              <nav className="flex  flex-col space-y-4 mt-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-foreground hover:text-foreground/80 text-left"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <span className="flex gap-1 items-center">
            <Image
              className="drop-shadow-xl shadow-gray-500 w-10 md:w-14"
              src={k7logo} // Replace with your logo path
              alt="K7 Knowledge Organizer"
              width={40}
              height={40}
            />
          </span>
          </div>
          {/* Desktop Navigation - Hidden on mobile */}
          <ul
            className={`hidden md:flex space-x-6 ${isRTL ? "mr-24" : "ml-24"}`}
          >
            {menuItems.map((item) => (
              <li key={item.id}>
                <Button
                  onClick={() => scrollToSection(item.id)}
                  className={`text-white font-semibold shadow-none bg-transparent hover:border-b-2 hover:border-blue-500 transition-colors ${
                    isRTL ? " text-xl" : ""
                  }`}
                >
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>

          {/* Get Started Button */}
          <div className="flex gap-2">
            <LanguageSwitcher className="text-white" />
            <Button
            className={`bg-[#38BDF8] w-fit  text-slate-900  hover:bg-gray-100 hover:text-blue-500 transition-colors ease-in rounded-full ${isRTL ? 'text-xl font-bold text-black' : ''}`}
          >
            <Link href="/login">{t('features.getStarted')}</Link>
          </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
