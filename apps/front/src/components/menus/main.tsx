"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "@/store";
import { Employee } from "@seminar/common";
import { authError, authLoading } from "@/store/utils";
import { useRouter } from "next/navigation";
import { UserMenuDisplay } from "./user";

export function MainMenu() {
    const user = useAppSelector<Employee | null | undefined>(
        (state) => state.auth.user
    );

    const [width, setWidth] = useState(0);
    const [menuDeployed, setMenuDeployed] = useState(false);

    const router = useRouter();

    const breakpoint = 700;
    const handleResizeWindow = () => setWidth(window.innerWidth);

    useEffect(() => {
        handleResizeWindow();
    }, []);

    useEffect(() => {
        window.addEventListener("resize", handleResizeWindow);
        return () => {
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, []);

    useEffect(() => {
        if (authError(user)) {
            return router.push("/login");
        }

        return;
    }, [router, user]);

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
                        <Link href="/compatibility">Compatibility</Link>

                        <div className="ml-auto">
                            <UserMenuDisplay user={user} />
                        </div>
                    </>
                ) : (
                    <div className="ml-auto flex gap-2 items-center">
                        <EllipsisHorizontalIcon
                            className="size-5"
                            onClick={() => setMenuDeployed(!menuDeployed)}
                        />
                        <UserMenuDisplay user={user} />
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
                    <Link href="/compatibility">Compatibility</Link>
                </div>
            )}
        </div>
    );
}
