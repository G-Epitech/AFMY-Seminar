export function Subtitle({ text }: { text: string }) {
    return (
        <div className="text-3xl font-extrabold tracking-tight">
            <h1>
                Customer{" "}
                <span className="text-transparent bg-gradient-to-r from-[#FCAF6F] to-[#F97316] bg-clip-text">
                    Details
                </span>
            </h1>
        </div>
    );
}
