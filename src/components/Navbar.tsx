"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/context/auth-context";

export const Navbar = () => {
  const { isLoggedIn } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <img src="/tiliLogo.png" alt="Tili" className="h-10 w-auto" />
        </Link>
        <div className="hidden md:flex items-center gap-8 font-display text-sm font-medium">
          <Link href="/#features" className="text-foreground/70 hover:text-foreground transition-colors">Fonctionnalités</Link>
          <Link href="/#pricing" className="text-foreground/70 hover:text-foreground transition-colors">Tarifs</Link>
          <Link href="/#order" className="text-foreground/70 hover:text-foreground transition-colors">Commander</Link>
          {isLoggedIn && (
             <Link href="/admin" className="text-foreground/70 hover:text-foreground transition-colors">Accéder au panel</Link>
          )}
        </div>
        <div className="flex gap-5 items-center">
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <>
              <a href="/register">
                <Button variant="hero" size="default">
                  S'inscrire
                </Button>
              </a>
              <a href="/login">
                <Button variant="outline" size="default">
                  Se connecter
                </Button>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
