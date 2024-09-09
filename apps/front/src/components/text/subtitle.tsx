export function Subtitle({ text }: { text: string }) {
    const splitText = text.split(" ");
    const divRule = "text-3xl font-extrabold tracking-tight";
    const textRule = "text-transparent bg-gradient-to-r from-[#FCAF6F] to-[#F97316] bg-clip-text";

    if (splitText.length < 2) {
        return (
        <div className={divRule}>
            <h1>
              <span className={textRule}>
                {splitText[0]}
              </span>
            </h1>
        </div>
      );
    }

    return (
        <div className={divRule}>
            <h1>
                {splitText[0]}{" "}
                <span className={textRule}>
                    {splitText[1]}
                </span>
            </h1>
        </div>
    );
}
