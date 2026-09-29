"use client";

import { cx } from "@/utils/cx";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import BlackBox from "../ui/black-box";
import { useAuth } from "../providers/auth-provider";
import UserAccountButton from "../ui/user-account-button";

const Header = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("Header mounted");
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      setIsLoaded(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // fix bad-state loaded page
    handleScroll();

    return () => {
      console.log("Header unmounted");
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cx(
        "sticky top-2 m-2 mt-0 rounded-b-3xl bg-surface/70 p-2 flex justify-between items-center backdrop-blur-xs transition-all",
        isScrolled ? "pt-4 -top-2" : "rounded-t-3xl",
        isLoaded ? "" : "-translate-y-20",
      )}
    >
      <div data-name="left" className="flex justify-start items-center">
        <BlackBox />
      </div>
      <div data-name="right" className="flex justify-end items-center">
        {user ? (
          <UserAccountButton />
        ) : (
          <Button onPress={() => router.push("/login")}>Log In</Button>
        )}
      </div>
    </header>
  );
};

export default Header;
