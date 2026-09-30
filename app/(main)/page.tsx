import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  return (
    <div className='flex flex-col'>
      <UserButton />
      <ModeToggle />
      <p>
        Hello Discord Clone
      </p>
      <Button>
        Click me
      </Button>
    </div>
  );
}
