import { notFound } from "next/navigation";

// An address under a language that is no page of the site: the site's own 404
// (not-found.tsx, in the layout). Without this, a path that matches no route would
// get Next's bare page: the root layout is under [lang], so there is no root
// not-found.tsx for it to fall back on.
export default function Missing() {
  notFound();
}
