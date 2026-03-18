"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/context/auth-context";

export const Navbar = () => {
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Image src="/tiliLogo.png" alt="Tili" width={40} height={40} priority className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8 font-display text-sm font-medium">
          <Link href="/#features" className="text-foreground/70 hover:text-foreground transition-colors">Fonctionnalités</Link>
          <Link href="/#pricing" className="text-foreground/70 hover:text-foreground transition-colors">Tarifs</Link>
          <Link href="/#order" className="text-foreground/70 hover:text-foreground transition-colors">Commander</Link>
          {isLoggedIn && (
            <Link href="/admin" className="text-foreground/70 hover:text-foreground transition-colors">Accéder au panel</Link>
          )}
        </div>

        <div className="hidden md:flex gap-5 items-center">
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

        <div className="md:hidden flex items-center gap-2">
          {isLoggedIn && <UserMenu />}
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t animate-in slide-in-from-top-2">
          <div className="container py-4 flex flex-col gap-4">
            <Link
              href="/#features"
              className="text-foreground/70 hover:text-foreground transition-colors font-display text-sm font-medium py-2"
              onClick={closeMenu}
            >
              Fonctionnalités
            </Link>
            <Link
              href="/#pricing"
              className="text-foreground/70 hover:text-foreground transition-colors font-display text-sm font-medium py-2"
              onClick={closeMenu}
            >
              Tarifs
            </Link>
            <Link
              href="/#order"
              className="text-foreground/70 hover:text-foreground transition-colors font-display text-sm font-medium py-2"
              onClick={closeMenu}
            >
              Commander
            </Link>
            {isLoggedIn && (
              <Link
                href="/admin"
                className="text-foreground/70 hover:text-foreground transition-colors font-display text-sm font-medium py-2"
                onClick={closeMenu}
              >
                Accéder au panel
              </Link>
            )}

            <div className="border-t border-foreground/10 my-2" />

            {!isLoggedIn && (
              <div className="flex flex-col gap-3">
                <a href="/register" onClick={closeMenu} className="w-full">
                  <Button variant="hero" size="default" className="w-full">
                    S'inscrire
                  </Button>
                </a>
                <a href="/login" onClick={closeMenu} className="w-full">
                  <Button variant="outline" size="default" className="w-full">
                    Se connecter
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
