"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SellerListingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/seller/listings");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#8A9A5B] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
