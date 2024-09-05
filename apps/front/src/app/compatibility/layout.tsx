import { MainMenu } from "@/components/menus/main";

const containerClassName = "container m-auto py-6 px-2";

export default function CompatibilityLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <MainMenu />
            <div className={containerClassName}>{children}</div>
        </>
    );
}
