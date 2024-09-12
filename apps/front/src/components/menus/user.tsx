import { Employee } from "@seminar/common";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { credentials } from "@/auth/credentials";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export function UserMenuDisplay({
    user,
}: {
    user: Employee | null | undefined;
}) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const disconnect = async () => {
        credentials.remove();
        dispatch(setUser(null));

        router.push("/auth/login");
    }

    const forgotPassword = async () => {
        router.push("/auth/forgot-password");
    }

    if (!user) {
        return (
            <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">...</AvatarFallback>
            </Avatar>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="h-7 w-7">
                    <AvatarImage src={user.photo || ""} alt="avatar" />
                    <AvatarFallback className="text-xs">
                        {`${user.name[0]}${user.surname[0]}`}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{`${user.name} ${user.surname}`}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={forgotPassword}>
                    Forgot password
                </DropdownMenuItem>
                <DropdownMenuItem className=" text-red-500" onClick={disconnect}>
                    Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
