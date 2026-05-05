"use client"; // Error boundaries must be Client Components

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col py-12 px-4 items-center justify-center min-h-150 gap-5 text-white">
      <span className="flex items-center gap-3">
        <h1 className="text-dark-300 text-3xl font-bold">Error</h1>-
        <h2 className="text-dark-500">An Error Occured</h2>
      </span>
      <p>{error.message}</p>
      <p>
        <button
          className="bg-gray-600 py-2 px-4 rounded-md  text-purple-100 cursor-pointer"
          onClick={() => {
            reset();
            router.refresh();
          }}
        >
          Refresh
        </button>
      </p>
    </div>
  );
}
