"use client";

import { cx } from "@/utils/cx";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
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
    <header
      className={cx(
        "sticky top-2 m-2 mt-0 rounded-b-2xl bg-surface/70 p-2 flex justify-between items-center backdrop-blur-xs transition-all",
        isScrolled ? "pt-4 -top-2" : "rounded-t-2xl",
        isLoaded ? "" : "-translate-y-20",
      )}
    >
      <div data-name="left" className="flex justify-start items-center">
        <div
          data-theme="dark"
          className="w-fit aspect-3/2 flex justify-center items-center p-2 dark rounded-2xl bg-background backdrop-blur-2xl text-foreground"
        >
          BlackBox
        </div>
      </div>
      <div data-name="right" className="flex justify-end items-center">
        <Button onPress={() => console.log("Button pressed")}>Click me</Button>
      </div>
    </header>
  );
};

export default Header;
