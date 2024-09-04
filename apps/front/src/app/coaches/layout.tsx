import { MainMenu } from "@/components/menus/main";

const containerClassName = "container m-auto py-6";

export default function CoachesLayout({
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
