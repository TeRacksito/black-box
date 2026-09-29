"use client";

import { cx } from "@/utils/cx";
import { useEffect, useState } from "react";

const Header = () => {
  const [isBottom, setIsBottom] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsBottom(
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight,
      );
      setIsLoaded(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // fix bad-state loaded page
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <footer
        data-theme="dark"
        className={cx(
          "sticky bottom-0 bg-background text-muted m-2 mb-0 p-2 rounded-t-3xl transition-all duration-500",
          isLoaded && isBottom ? "" : "translate-y-20",
        )}
      >
        By <a href="https://github.com/TeRacksito">TeRacksito</a>
      </footer>
    </div>
  );
};

export default Header;
