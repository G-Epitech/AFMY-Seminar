import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function MainMenu() {
    return (
        <div className="border-b py-3">
            <div className="container m-auto flex gap-5 text-sm items-center">
                <div className="flex items-center gap-1">
                    <h3 className="font-bold text-base">Soul Connection</h3>
                    <i className="fa-solid fa-message-heart" style={{color: "#f97316"}} />
                </div>

                <Link href="/dashboard">Dashboard</Link>
                <Link href="/coaches">Coaches</Link>
                <Link href="/customers">Customers</Link>
                <Link href="/tips">Tips</Link>
                <Link href="/events">Events</Link>

                <Avatar className="ml-auto h-7 w-7">
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}
