"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
import { config } from "@/lib/config";
import { credentials } from "@/auth/credentials";
import auth from "@/api/auth";

async function getBase64Image(
    url: string,
    setBase64: React.Dispatch<React.SetStateAction<string>>
) {
    const tokens = credentials.get();
    if (auth && !tokens.access) return null;

    const response = await fetch(`${config.api.url}${url}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
            "Content-Type": "image/png",
            Authorization: `Bearer ${tokens.access}`,
        },
    });

    if (!response.ok) return;

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    setBase64(`data:image/png;base64,${base64}`);
}

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => {
    const [base64, setBase64] = React.useState<string>("");

    React.useEffect(() => {
        if (props.src && props.src.length > 1)
          getBase64Image(props.src, setBase64);
    }, [props.src]);

    return (
        <AvatarPrimitive.Image
            ref={ref}
            className={cn("aspect-square h-full w-full", className)}
            {...props}
            src={base64}
        />
    );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
