"use client";

import { useAppSelector } from "@/store";
import { authError, authLoading } from "@/store/utils";
import { Employee } from "@seminar/common";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const user = useAppSelector<Employee | null | undefined>(
        (state) => state.auth.user
    );

    const router = useRouter();

    useEffect(() => {
      if (authLoading(user)) return;
      if (authError(user)) return router.push("/auth/login");

      return router.push("/dashboard");
    }, [user, router])

    return <main></main>;
}
