"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";

const LanguageSwitcher = ({className}:{className?:string}) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const changeLanguage = (newLocale: string) => {
    // "@ts-expect-error"
    router.replace(pathname,{ locale: newLocale });
  };

  return (
    <Select onValueChange={changeLanguage} defaultValue={locale}>
      <SelectTrigger className={`  w-fit text-xs gap-1 border-none md:gap-2 sm:border-blue-500 sm:border-2 ${className?className:'text-blue-800'} bg-transparent font-semibold rounded-full sm:w-auto sm:text-base`}>
        <Globe className="w-6 h-6" />
        {/* <SelectValue  className="hidden md:flex" placeholder="Select Language" /> */}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">Arabic</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
