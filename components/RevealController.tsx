"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ports the shared scroll-reveal behaviour from the original `site.js`.
 * Every `[data-reveal]` element starts hidden (via CSS) and is revealed with
 * `.is-visible` as it sweeps into view. Re-runs on route changes so newly
 * mounted pages get their own reveal pass. Opt-out under reduced motion.
 */
export default function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (reduce) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const pending = new Set(
      items.filter((el) => !el.classList.contains("is-visible")),
    );
    const show = (el: Element) => {
      el.classList.add("is-visible");
      pending.delete(el as HTMLElement);
    };

    // Sweep, not threshold crossings: an element jumped clean past (anchor
    // jump, deep link, scroll restore) still gets revealed.
    const sweep = () => {
      const h = window.innerHeight;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < h * 0.92) show(el);
      });
      if (!pending.size) detach();
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        sweep();
      });
    };

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((e) => {
                if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
                  show(e.target);
                  io!.unobserve(e.target);
                }
              });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
          )
        : null;

    const detach = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sweep);
      io?.disconnect();
    };

    sweep();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sweep);
    pending.forEach((el) => io?.observe(el));

    return detach;
  }, [pathname]);

  return null;
}
