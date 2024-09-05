import { Title } from "@/components/text/title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    return (
        <main className="relative h-screen flex items-center justify-center">
            <div className="md:w-[500px] w-[300px]">
                <Title text="Agence Dashboard" />
                <h3 className="text-lg font-semibold text-slate-500">Connection to your account</h3>

                <div className="mt-3 flex flex-col gap-2">
                    <Input placeholder="Email" type="email" />
                    <Input placeholder="Password" type="password" />
                    <Button>Connection</Button>
                </div>
            </div>
        </main>
    );
}
