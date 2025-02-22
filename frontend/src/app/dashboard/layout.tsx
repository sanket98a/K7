import { CustomSidebar } from "@/components/Chat/CustomSidebar";
import {ChatHeader} from "@/components/Chat/Header";
import { DashBoardSidebar } from "@/components/DashBoardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <>
      <section className="flex font-poppins bg-gray-100">
      <CustomSidebar /> 
      <main className="w-full ">
        <ChatHeader/>
        
        {children}
       
      </main>
      </section>
   
    </>
    );
  }