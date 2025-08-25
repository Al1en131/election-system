"use client";
import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import sodium from "libsodium-wrappers";

export default function OrgPage() {
  const router = useRouter();
  const { orgId } = router.query;
  const [org, setOrg] = useState<any>(null);
  const [elections, setElections] = useState<any[]>([]);
  useEffect(() => {
    if (!orgId) return;
    (async () => {
      const r1 = await fetch(`/api/orgs`);
      // fetch org/elections by API if implemented
    })();
  }, [orgId]);

  return <div>Organization page (list elections) — implement UI</div>;
}
