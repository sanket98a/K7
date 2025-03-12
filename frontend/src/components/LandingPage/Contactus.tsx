"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { motion } from "framer-motion";
import Link from "next/link"

import { Label } from "@/components/ui/label"
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Textarea } from "../ui/textarea";
import { useTranslations, useLocale } from "next-intl";

const info = [
  {
    icon: <FaPhoneAlt />,
    title: "Phone",
    description: "+1 322 6334377",
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    description: "k7assistant@datareason.ai",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Address",
    description: "Street number 4, Canada",
  },
];

export const ContactUs = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.3, duration: 0.4, ease: "easeIn" },
      }}
      className="py-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          <div className="form xl:w-[54%] order-2 xl:order-none">
            <form className="flex flex-col gap-6 p-10  border-l-2 bg-white/20 border-blue-500 rounded-xl">
              <h3 className="text-4xl text-blue-500">Reach out to Us</h3>
             

              <div className="inputFields grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input className="border-blue-500 border bg-gray-200" type="firstname" placeholder="Firstname" />
                <Input className="border-blue-500 border bg-gray-200"  type="lastname" placeholder="Lastname" />
                <Input className="border-blue-500 border bg-gray-200"  type="email" placeholder="Email address" />
                <Input className="border-blue-500 border bg-gray-200"  type="phone" placeholder="Phone number" />
              </div>
             
              <Textarea
                className="h-[100px] border-blue-500 border bg-gray-200"
                placeholder="Type your message here"
              />
              {/* send message button */}
              <Button className="max-w-40 bg-blue-500">Send Message</Button>
            </form>
          </div>
          <div className="info flex items-center xl:justify-end order-1 xl-order-none mb-8 xl:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map((item, index) => {
                return (
                  <li key={index} className="flex items-center gap-6">
                    <div
                      className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-white/20 text-accent rounded-md flex items-center justify-center"
                    >
                      <div className="text-[28px] text-blue-500 ">{item.icon}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-200">{item.title}</p>
                      <h3 className="text-xl text-gray-200">{item.description}</h3>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
export const ContactUsOne = () => {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('HomePage.contact')
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.3, duration: 0.4, ease: "easeIn" },
      }}
      className="py-6"
    >
      <div className="container bg-white/5 rounded-2xl shadow-lg max-w-5xl mx-auto" >
        <div className="flex flex-col xl:flex-row gap-[30px]">
          <div className="form xl:w-[54%] order-2 xl:order-none">
            <form className="flex flex-col gap-6 p-10    rounded-3xl" dir={isRTL ? 'rtl' : 'ltr'}>
              <h3 className="text-4xl text-gray-100 font-semibold">{t("formTitle")}</h3>
             

              <div className="inputFields grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input className="border-blue-500 border bg-gray-200" type="firstname" placeholder={t("name")} />
                <Input className="border-blue-500 border bg-gray-200"  type="lastname" placeholder={t("name")} />
                <Input className="border-blue-500 border bg-gray-200"  type="email" placeholder={t("email")} />
                <Input className="border-blue-500 border bg-gray-200"  type="phone" placeholder={t("phone")} />
              </div>
             
              <Textarea
                className="h-[100px] border-blue-500 border bg-gray-200"
                placeholder={t("message")}
              />
         
                <Button className="max-w-40 bg-blue-500">{t("send")}</Button>
            </form>
          
          </div>
          <div className="info flex items-center xl:justify-end order-1 xl-order-none mb-8 xl:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map((item, index) => {
                return (
                  <li key={index} className="flex items-center gap-6">
                    <div
                      className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-gray-200 text-accent rounded-md flex items-center justify-center"
                    >
                      <div className="text-[28px] text-blue-500 ">{item.icon}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-200">{item.title}</p>
                      <h3 className="text-xl text-gray-200">{item.description}</h3>
                    </div>
                  </li>
                );
              })}
              {/* <div className="flex gap-6 mx-auto justify-center">
                  {[Facebook, Twitter, Instagram, Linkedin].map(
                    (Icon, index) => (
                      <Button
                        key={index}
                        variant="secondary"
                        size="icon"
                        className="bg-gray-200 shadow-md text-blue-500 rounded-md w-10 h-10"
                      >
                        <Icon className="w-5 h-5" />
                      </Button>
                    )
                  )}
                </div> */}
            </ul>
            
          </div>
          
        </div>
        
      </div>
    </motion.section>
  );
};







export const  ContactUsTwo=()=> {

  return (
    <div className="min-h-screen  grid lg:grid-cols-2">
      {/* Left Section with Background */}
      <div className="relative hidden lg:flex flex-col rounded-md max-w-4xl justify-center p-12 bg-gradient-to-b from-purple-900 via-violet-900 to-blue-900">
        <div className="relative z-10 space-y-6">
          <div className="inline-block rounded-lg bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-xl">
            Contact Us
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl xl:text-6xl/none">
            Let&apos;s Get
            <br />
            In Touch.
          </h1>
          <p className="text-lg text-gray-300">
            Or just reach out manually to{" "}
            <Link
              href="mailto:hello@example.com"
              className="text-white hover:text-purple-200 underline underline-offset-4"
            >
              hello@example.com
            </Link>
          </p>
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-violet-900/50 to-blue-900/50 backdrop-blur-sm" />
      </div>

      {/* Right Section with Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-gray-950">
        <div className="w-full max-w-xl space-y-8">
          <div className="lg:hidden space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Let&apos;s Get In Touch</h2>
            <p className="text-gray-400">We&apos;d love to hear from you</p>
          </div>

          <form  className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name..."
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address..."
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Phone Number
              </Label>
              <div className="flex">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+44 (000) 000-0000"
                  className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Enter your main text here..."
                className="min-h-[120px] bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                required
              />
            </div>

       

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white"
            
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}


