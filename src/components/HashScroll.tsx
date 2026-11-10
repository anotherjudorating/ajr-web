"use client";

import { useEffect } from "react";

import { scrollWhileGrowing, useHash } from "@/components/anchors";

// For a section of a server component: put it inside the element with this id, and
// a link to the page with #id scrolls there once the section is on the page (Next
// itself scrolls to a hash only if the section is there at the first commit).
export function HashScroll({ id }: { id: string }) {
  const hash = useHash();
  useEffect(() => {
    if (hash !== id) return;
    const section = document.getElementById(id);
    if (section) scrollWhileGrowing(section);
  }, [hash, id]);
  return null;
}
