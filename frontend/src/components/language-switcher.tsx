"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const changeLanguage = (newLocale: string) => {
    // "@ts-expect-error"
    router.replace(pathname,{ locale: newLocale });
  };

  return (
    <Select onValueChange={changeLanguage} defaultValue={locale}>
      <SelectTrigger className="w-max gap-2 border-blue-500 border-2 text-blue-800 font-semibold rounded-full">
        <Globe className="w-4 h-4" />
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">Arabic</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
