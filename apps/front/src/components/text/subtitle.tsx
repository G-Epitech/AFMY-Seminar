export function Subtitle({ text }: { text: string }) {
    const splitText = text.split(" ");
    return (
        <div className="text-3xl font-extrabold tracking-tight">
            <h1>
                {splitText[0]}{" "}
                <span className="text-transparent bg-gradient-to-r from-[#FCAF6F] to-[#F97316] bg-clip-text">
                    {splitText[1]}
                </span>
            </h1>
        </div>
    );
}
