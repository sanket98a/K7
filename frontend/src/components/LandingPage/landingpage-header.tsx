"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import k7logo from '@/assets/k7logo2.png'

export default function NavHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > window.innerHeight * 0.8
      setScrolled(isScrolled)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full  px-8 mx-auto transition-all duration-300 ${
        scrolled ? "bg-gradient-to-r from-slate-900 to-slate-700" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-2">
        <div className="flex justify-between items-center">
          {/* Mobile Menu Button - Only visible on mobile */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" className="text-white p-2 rounded-full">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col space-y-4 mt-6">
                {["Home", "Features", "About Us", "Contact"].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))}
                    className="text-foreground hover:text-foreground/80 text-left"
                  >
                    {item}
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

          {/* Desktop Navigation - Hidden on mobile */}
          <ul className="hidden md:flex space-x-6">
            {["Home", "Features", "About Us", "Contact"].map((item) => (
              <li key={item}>
                <Button
                  onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))}
                  className="text-white font-semibold shadow-none bg-transparent hover:text-blue-500 transition-colors"
                >
                  {item}
                </Button>
              </li>
            ))}
          </ul>

          {/* Get Started Button */}
          <Button
            variant="secondary"
            className="bg-[#38BDF8] text-slate-900 font-semibold hover:bg-gray-100 hover:text-blue-500 transition-colors ease-in rounded-full"
          >
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

