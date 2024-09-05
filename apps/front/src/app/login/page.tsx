"use client";

import api from "@/api";
import { credentials } from "@/auth/credentials";
import { Title } from "@/components/text/title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const response = await api.auth.login({email, password});

        if (!response || !response.ok) return;

        await credentials.save(response.data.tokens);
        router.push("/dashboard");
    }

    return (
        <main className="relative h-screen flex items-center justify-center">
            <div className="md:w-[500px] w-[300px]">
                <Title text="Agence Dashboard" />
                <h3 className="text-lg font-semibold text-slate-500">
                    Connection to your account
                </h3>

                <div className="mt-3 flex flex-col gap-2">
                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handleLogin}>Connection</Button>
                </div>
            </div>
        </main>
    );
}
