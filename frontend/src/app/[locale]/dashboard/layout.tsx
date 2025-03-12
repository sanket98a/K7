import { CustomSidebar } from "@/components/Chat/CustomSidebar";
import {ChatHeader} from "@/components/Chat/Header";


export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <>
      <section className="flex font-poppins bg-gray-100">
      <CustomSidebar /> 
      <main className="w-full h-screen p-2 border">
        <ChatHeader/>
        
        {children}
       
      </main>
      </section>
   
    </>
    );
  }