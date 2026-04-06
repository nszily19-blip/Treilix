import { Suspense } from "react";
import ClaimContent from "./ClaimContent";

export default function ClaimPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClaimContent />
    </Suspense>
  );
}