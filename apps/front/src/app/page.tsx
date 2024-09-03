import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  return (
    <main>
     <Link href="/coaches">
        <Button>Coaches</Button>
      </Link>
    </main>
  );
}
