"use client";
import { ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import useAuth from "@/hooks/user-auth";
import { useAuthStore } from "@/state/AuthStore";
import { MobileDashboardSidebar } from "./CustomSidebar";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import LanguageSwitcher from "../language-switcher";

interface CustomHeaderProps {
  userName?: string;
}

export function ChatHeader({ userName = "User" }: CustomHeaderProps) {
  const { logout } = useAuth();
  const { userInfo } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("navigation");

  const [isPending, startTransition] = useTransition();
  function getAvatarName(name: string) {
    if (!name) return "??";
    const nameParts = name.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].slice(0, 2).toUpperCase();
    }
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }

  const userDisplayName = userInfo?.name || userName;
  const avatarLetters = getAvatarName(userDisplayName);

  const handleLanguageChange = (language: string) => {
    const newLocale = language === "en" ? "en" : "ar";
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: newLocale }
      );
    });
  };

  return (
    <header
      className={`flex h-14 items-center justify-between md:justify-end gap-2 md:gap-4 w-full md:max-w-7xl  mx-auto`}
    >
      {/* Help Icon */}
      {/* <span className="flex gap-1 items-center">
    <Image className="drop-shadow-xl shadow-gray-500 w-8" src={k7logo} alt="K7 Knowledge Organizer" width={40} height={40} />
      <h1 className="text-xl md:text-3xl bg-gradient-to-b from-slate-500 to-gray-800 bg-clip-text text-transparent font-poppins font-semibold"> Info Harbor</h1>
      </span> */}
      <MobileDashboardSidebar />
      <div className="profileButtons flex  items-center  gap-2 md:gap-4 sm:px-6">
        <LanguageSwitcher />
        {/* Language Switcher */}
        {/* 
        <button
          className="rounded-full p-2 hover:bg-gray-100"
          aria-label={t('navigation.help')}
        >
          <HelpCircle className="h-6 w-6 font-semibold text-blue-800" />
        </button> */}

        {/* Settings Icon */}
        {/* <button
          className="rounded-full p-2 hover:bg-gray-100"
          aria-label={t('navigation.settings')}
        >
          <Settings className="h-6 w-6 font-semibold text-blue-800" />
        </button> */}

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex gap-2 items-center cursor-pointer">
              <Avatar className="h-8 w-8">
                {" "}
                <AvatarFallback className="bg-blue-800 text-white">
                  {avatarLetters}
                </AvatarFallback>{" "}
              </Avatar>
              {/* <span className="p-2 rounded-[50px] bg-blue-500 text-white"></span> */}
              <span className=" text-blue-800 font-medium hidden sm:block ">
                {userDisplayName}
              </span>
              <ChevronDown className="h-4 w-4 text-blue-800" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" /> {t("logout")}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
