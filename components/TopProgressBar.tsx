"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Slim top-of-page progress bar for client-side route transitions.
 *
 * Pages on this site are server-rendered per request (they read Supabase), so a
 * navigation can lag for a beat — this gives immediate visual feedback. It is
 * dependency-free and themed to the site (bay → gold).
 *
 * Behaviour:
 *  - Starts on a click of an internal link, after a short debounce so instant,
 *    prefetched navigations don't flash the bar.
 *  - "Trickles" toward 90% while the new route is being fetched.
 *  - Jumps to 100% and fades out when the pathname actually changes.
 */
export default function TopProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const delayRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const trickleRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const hideRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const firstRun = useRef(true);

  // Start the bar on internal-link clicks.
  useEffect(() => {
    const start = () => {
      if (delayRef.current) clearTimeout(delayRef.current);
      if (trickleRef.current) clearInterval(trickleRef.current);
      if (hideRef.current) clearTimeout(hideRef.current);

      // Only reveal if the navigation is actually taking a moment.
      delayRef.current = setTimeout(() => {
        setVisible(true);
        setProgress(12);
        trickleRef.current = setInterval(() => {
          setProgress((p) => {
            if (p >= 90) return p;
            const step = p < 45 ? 9 : p < 70 ? 5 : 2;
            return Math.min(90, p + step);
          });
        }, 380);
      }, 120);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return; // opens a new tab/window
      if (anchor.hasAttribute("download")) return;
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:"))
        return;

      let dest: URL;
      try {
        dest = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (dest.origin !== window.location.origin) return; // external site
      if (dest.pathname === window.location.pathname) return; // same page

      start();
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (delayRef.current) clearTimeout(delayRef.current);
      if (trickleRef.current) clearInterval(trickleRef.current);
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, []);

  // Finish the bar whenever the route actually changes.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (delayRef.current) clearTimeout(delayRef.current);
    if (trickleRef.current) clearInterval(trickleRef.current);

    setProgress(100);
    hideRef.current = setTimeout(() => {
      setVisible(false);
      // Reset width once it has faded, so the next run starts from the left.
      hideRef.current = setTimeout(() => setProgress(0), 350);
    }, 200);
  }, [pathname]);

  return (
    <div
      className="route-progress"
      data-visible={visible ? "true" : "false"}
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
}
