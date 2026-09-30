import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className='flex flex-col'>
      <UserButton />
      <p>
        Hello Discord Clone
      </p>
      <Button>
        Click me
      </Button>
    </div>
  );
}
