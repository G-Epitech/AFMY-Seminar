"use client";

import api from "@/api";
import { Title } from "@/components/text/title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  
  const router = useRouter();
  const { toast } = useToast();

  const handleForgot = async () => {
    setError("");
    const response = await api.auth.forgotPassword({ email });

    if (!response || !response.ok) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred, please try again",
      });
      return;
    }
    toast({
      variant: "default",
      title: "Request sent",
      description: "If the email exists, you will receive a reset link",
    });
    router.push("/auth/login");
  };

  return (
    <main className="relative h-screen flex items-center justify-center">
      <div className="md:w-[500px] w-[300px]">
        <Title text="Agence Dashboard" />
        {!error ? (
          <h3 className="text-lg font-semibold text-slate-500">
            Forgot your password?
          </h3>
        ) : (
          <h3 className="text-lg font-semibold text-red-600">
            {error}
          </h3>
        )}

        <div className="mt-3 flex flex-col gap-2">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleForgot}>Send an Email</Button>
        </div>
      </div>
    </main>
  );
}
