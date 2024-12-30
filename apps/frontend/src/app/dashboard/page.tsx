"use client";

import { LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect } from "react";

export default function DashboardPage() {
  const { accessTokenRaw } = useKindeBrowserClient()
  console.log("accessTokenRaw", accessTokenRaw)

  useEffect(() => {
    if (!accessTokenRaw) return ;
    const getData = async () => {
      const responce = await fetch("http://localhost:5000/api/protected",{
        headers:{
          Authorization:`Bearer ${accessTokenRaw}`,
        }
      });
      const data = await responce.json();
      console.log(data);
    };
    getData();
  }, [accessTokenRaw]);
  
    
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-4 text-lg">Welcome, user</p>
      <LogoutLink > Log Out</LogoutLink>
    </div>
  );
}
