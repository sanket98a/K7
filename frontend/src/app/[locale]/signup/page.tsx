import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import k7full from "@/assets/k7full.png";
import Link from "next/link";
import { SignUpForm } from "@/components/SignUpForm";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-gray-100">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src={k7full}
          height={450}
          width={500}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            K7 Knowledge Organizer
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <SignUpForm />
          </div>
        </div>
      </div>
      
    </div>
  );
}
