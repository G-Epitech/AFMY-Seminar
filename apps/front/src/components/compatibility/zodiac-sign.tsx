import { AstrologicalSign } from "@seminar/common";
import Image from "next/image";

const zodiacSigns: { [key in AstrologicalSign]: string } = {
  Aries: "/zodiac-signs/sagittarius.svg",
  Taurus: "/zodiac-signs/taurus.svg",
  Gemini: "/zodiac-signs/gemini.svg",
  Cancer: "/zodiac-signs/cancer.svg",
  Leo: "/zodiac-signs/leo.svg",
  Virgo: "/zodiac-signs/virgo.svg",
  Libra: "/zodiac-signs/libra.svg",
  Scorpio: "/zodiac-signs/scorpio.svg",
  Sagittarius: "/zodiac-signs/sagittarius.svg",
  Capricorn: "/zodiac-signs/capricorn.svg",
  Aquarius: "/zodiac-signs/aquarius.svg",
  Pisces: "/zodiac-signs/pisces.svg",
};

export function ZodiacSign({ sign }: { sign: AstrologicalSign | undefined }) {
  if (!sign) return <></>;
  return (
    <Image priority src={zodiacSigns[sign]} width={24} height={24} alt={sign} />
  );
}
