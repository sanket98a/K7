import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  return (
    <div className="min-h-screen ">
      <div className="container relative mx-auto px-4   ">
        <div className="grid md:grid-cols-2 items-start max-w-6xl mx-auto rounded-2xl overflow-hidden">
          {/* Left Section */}
          <div className="relative p-8 bg-gradient-to-br from-slate-500 to-gray-700">
            

            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">
                Let&apos;s get in touch
              </h2>
              <p className="text-white/80 mb-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
                dolorum adipisci recusandae praesentium dicta!
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-white">
                  <MapPin className="w-5 h-5" />
                  <span>92 Cherry Drive Uniondale, NY 11553</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <Mail className="w-5 h-5" />
                  <span>lorem@ipsum.com</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <Phone className="w-5 h-5" />
                  <span>123-456-789</span>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-white mb-4">Connect with us:</h3>
                <div className="flex gap-3">
                  {[Facebook, Twitter, Instagram, Linkedin].map(
                    (Icon, index) => (
                      <Button
                        key={index}
                        variant="secondary"
                        size="icon"
                        className="bg-white/5 shadow-md text-white rounded-md w-10 h-10"
                      >
                        <Icon className="w-5 h-5" />
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-gray-200 p-8 h-full">
            <h2 className="text-2xl font-bold text-slate-700 mb-6">Contact Us</h2>
            <form className="space-y-4">
              <div>
                <Label htmlFor="username" className="sr-only">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Username"
                  className="border-black border"
                />
              </div>
              <div>
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="border-black border"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="sr-only">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone"
                  className="border-black border"
                />
              </div>
              <div>
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Message"
                  className="border-black border"
                />
              </div>
              <Button
                type="submit"
                className=""
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
