"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="py-5 fixed top-0 w-full z-50">
      <div className="flex h-20 justify-between bg-white/30 backdrop-blur-lg border-white/20 items-center w-[90%] mx-auto rounded-3xl py-10 px-10">
        <div>
          <Link href="/" className="font-bold text-xl flex">
            <Image
              src="/assets/logo/LogoNavbar.png"
              alt="Logo Navbar"
              width={220}
              height={200}
            />
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="gap-10 text-primary-300 font-bold">
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                Beranda
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer">
                  Agroguide
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gradient-to-br from-white/30 to-white/20">
                  <DropdownMenuItem asChild>
                    <Link href="/agroguide/video">Video</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/agroguide/artikel">Artikel</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/agroevent" legacyBehavior passHref>
                Agroevent
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer">
                  Agrocare
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gradient-to-br from-white/30 to-white/20">
                  <DropdownMenuItem asChild>
                    <Link href="/agrocare/journaling">Journaling</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/agrocare/weather">Ramalan Cuaca</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center">
          {loading ? (
            <div className="text-sm px-3 py-2">Loading...</div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline">
                Hello, {user.name || user.email}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarFallback>
                        {user.name ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-gradient-to-br from-white/30 to-white/20"
                  align="end"
                >
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center">
              <Button size="sm" asChild>
                <Link className="" href="/login">
                  Masuk
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
