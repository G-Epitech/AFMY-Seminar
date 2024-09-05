"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useEffect, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

export function MainMenu() {
    const [width, setWidth] = useState(window.innerWidth);
    const [menuDeployed, setMenuDeployed] = useState(false);
    const breakpoint = 700;

    useEffect(() => {
        const handleResizeWindow = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResizeWindow);
        return () => {
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, []);

    return (
        <div className="border-b py-3">
            <div className="container m-auto flex gap-5 text-sm items-center px-2">
                <div className="flex items-center gap-1">
                    <h3 className="font-bold text-base">Soul Connection</h3>
                    <i
                        className="fa-solid fa-message-heart"
                        style={{ color: "#f97316" }}
                    />
                </div>

                {width > breakpoint ? (
                    <>
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/coaches">Coaches</Link>
                        <Link href="/customers">Customers</Link>
                        <Link href="/tips">Tips</Link>
                        <Link href="/events">Events</Link>

                        <Avatar className="ml-auto h-7 w-7">
                            <AvatarFallback className="text-xs">
                                JD
                            </AvatarFallback>
                        </Avatar>
                    </>
                ) : (
                    <div className="ml-auto flex gap-2 items-center">
                        <EllipsisHorizontalIcon
                            className="size-5"
                            onClick={() => setMenuDeployed(!menuDeployed)}
                        />
                        <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs">
                                JD
                            </AvatarFallback>
                        </Avatar>
                    </div>
                )}
            </div>
            {menuDeployed && (
                <div className="container m-auto flex flex-col gap-2 text-sm px-2 pt-1">
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/coaches">Coaches</Link>
                    <Link href="/customers">Customers</Link>
                    <Link href="/tips">Tips</Link>
                    <Link href="/events">Events</Link>
                </div>
            )}
        </div>
    );
}
