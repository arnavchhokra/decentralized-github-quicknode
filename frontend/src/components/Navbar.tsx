"use client";

import { Button } from "@/components/ui/button";
import {
NavigationMenu,
NavigationMenuContent,
NavigationMenuItem,
NavigationMenuLink,
NavigationMenuList,
NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
const navigationItems = [
    {
    title: "Home",
    href: "/",
    description: "",
    },
    {
    title: "Dashboard",
    description: "Managing a small business today is already tough.",
    },
    {
    title: "All Repos",
    description: "Managing a small business today is already tough.",
    },
];

const [isOpen, setOpen] = useState(false);
return (
    <header className="w-full z-40 fixed top-0 left-0 bg-background">
    <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
        <NavigationMenu className="flex justify-start items-start">
            <NavigationMenuList className="flex justify-start gap-4 flex-row">
            {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                    <>
                    <NavigationMenuLink>
                        <Button variant="ghost">{item.title}</Button>
                    </NavigationMenuLink>
                    </>
                </NavigationMenuItem>
            ))}
            </NavigationMenuList>
        </NavigationMenu>
        </div>
        <div className="flex lg:justify-center">
        <p className="font-semibold">DGIT</p>
        </div>
        <div className="flex justify-end w-full gap-4">
        <ConnectButton/>
        </div>
        <div className="flex w-12 shrink lg:hidden items-end justify-end">
        <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        {isOpen && (
            <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
            {navigationItems.map((item) => (
                <div key={item.title}>
                <div className="flex flex-col gap-2">
                    <Link
                        href={item.href||"#"}
                        className="flex justify-between items-center"
                    >
                        <span className="text-lg">{item.title}</span>
                        <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                    </Link>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    </div>
    </header>
);
};


export default Navbar;