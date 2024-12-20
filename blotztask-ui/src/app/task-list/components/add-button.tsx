import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AddTask() {
  return (
    <Link href="/add-task">
      <Button className="bg-[#F4F4F4] text-[#2C3233] border-[2px] border-[#2C3233]">
        <span className="">+ </span>Add Task
      </Button>
    </Link>
  );
}
