"use client";

import api from "@/api";
import { Title } from "@/components/text/title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams()
 
  const token = searchParams.get('token')
  const { toast } = useToast();

  const handleReset = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (!token) {
      setError("Invalid token");
      return;
    }
    const response = await api.auth.resetPassword({ password, token });

    if (!response || !response.ok) {
      setError("Invalid email or password");
      return;
    }

    toast({
      variant: "default",
      title: "Successfully reset password",
      description: "Your password has been successfully reset",
    });

    router.push("/auth/login");
  };

  return (
    <main className="relative h-screen flex items-center justify-center">
      <div className="md:w-[500px] w-[300px]">
        <Title text="Agence Dashboard" />
        {!error ? (
          <h3 className="text-lg font-semibold text-slate-500">
            Reset your password
          </h3>
        ) : (
          <h3 className="text-lg font-semibold text-red-600">
            {error}
          </h3>
        )}

        <div className="mt-3 flex flex-col gap-2">
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button onClick={handleReset}>Reset</Button>
        </div>
      </div>
    </main>
  );
}
