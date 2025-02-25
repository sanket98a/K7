"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginService, signupService } from "@/lib/auth";
import { useAppStore } from "@/state/store";

const useAuth = () => {
  const router = useRouter();
  const{userInfo,setUserInfo}:any=useAppStore()
const [isfetching,setIsFetching] = useState(false)
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const testUser = {
    id: "1",
    email: "fahadabbas817@gmail.com",
    password: "password",
  };

  const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).trim(),
  });
  const signupSchema = z.object({
    name: z.string({ message: "Please enter your name" }).trim(),
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).trim(),
  });

  const handleLogin = async(e:any) => {
    e.preventDefault();
    setErrorMessages([]);
    const schemaTest = loginSchema.safeParse(loginInfo);

    if (!schemaTest.success) {
      setErrorMessages(Object.values(schemaTest.error.flatten().fieldErrors).flat());
      return;
    }

    setIsFetching(true)
    try {
      const result = await loginService(loginInfo)
      setUserInfo(result)
      setIsFetching(false)
      console.log(result)
      console.log(userInfo)
      setErrorMessages([]);
      router.push("/dashboard");

    } catch (error:any) {
      console.log(error)
      setIsFetching(false)
      if (error.response?.data?.detail) {
        setErrorMessages([error.response.data.detail]); // Store API error directly
      } else {
        setErrorMessages(["Something went wrong. Please try again."]);
      }
     
    }

    // if (loginInfo.email !== testUser.email || loginInfo.password !== testUser.password) {
    //   setErrorMessages({ email: ["Invalid email or password"] });
    //   return;
    // }

    
  
  };

  const handleLSignUp = async(e:any) => {
    e.preventDefault();
    setErrorMessages([]);
    const schemaTest = signupSchema.safeParse(signupInfo);

    if (!schemaTest.success) {
      setErrorMessages(Object.values(schemaTest.error.flatten().fieldErrors).flat());
      return;
    }

    setIsFetching(true)
    try {
      const result = await signupService(signupInfo)
      setIsFetching(false)
      console.log(result)
      setErrorMessages([]);
      router.push("/login");
    } catch (error:any) {
      console.log(error)
      setIsFetching(false)
      if (error.response?.data?.detail) {
        setErrorMessages([error.response.data.detail]); // Store API error directly
      } else {
        setErrorMessages(["Something went wrong. Please try again."]);
      }
    }

    // if (loginInfo.email !== testUser.email || loginInfo.password !== testUser.password) {
    //   setErrorMessages({ email: ["Invalid email or password"] });
    //   return;
    // }

    
    
  };

  return {
    loginInfo,
    setLoginInfo,
    handleLogin,
    errorMessages,
    signupInfo,setSignupInfo,handleLSignUp,isfetching,setIsFetching
  };
};

export default useAuth;
