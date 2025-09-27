"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center pt-28">
      <div className="block md:max-w-lg">
        <Image
          alt="error 500"
          height={300}
          src="/images/internal-server-error.svg"
          width={300}
        />
      </div>
      <div className="text-center xl:max-w-4xl">
        <h1 className="mb-3 font-bold text-2xl text-gray-900 leading-tight sm:text-4xl lg:text-5xl dark:text-white">
          Something has gone seriously wrong
        </h1>
        <p className="mb-5 font-normal text-base text-gray-500 md:text-lg dark:text-gray-400">
          It's always time for a coffee break. We should be back by the time you
          finish your coffee.
        </p>
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
          <Link href="/">Go Back Home</Link>
          <Button variant={"outline"} onClick={() => reset()}>
            Retry Again
          </Button>
        </div>
      </div>
    </div>
  );
}
