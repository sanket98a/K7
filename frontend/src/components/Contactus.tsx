"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { motion } from "framer-motion";


import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Textarea } from "./ui/textarea";

const info = [
  {
    icon: <FaPhoneAlt />,
    title: "Phone",
    description: "+92 318 6333577",
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

const ContactUs = () => {
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
            <form className="flex flex-col gap-6 p-10 bg-gray-100 border-l-2 border-blue-500 rounded-xl">
              <h3 className="text-4xl text-blue-500">Reach out to Us</h3>
             

              <div className="inputFields grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input className="border-blue-500 border" type="firstname" placeholder="Firstname" />
                <Input className="border-blue-500 border"  type="lastname" placeholder="Lastname" />
                <Input className="border-blue-500 border"  type="email" placeholder="Email address" />
                <Input className="border-blue-500 border"  type="phone" placeholder="Phone number" />
              </div>
             
              <Textarea
                className="h-[100px] border-blue-500 border"
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
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactUs;
