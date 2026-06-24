import { useLocation } from "wouter";
import { Menu, X, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import logoSrc from "@assets/suissetvb_logo.png";

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const navigate = (path: string) => {
    setLocation(path);
    closeMenu();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <>
      {/* ── Top Navigation Bar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 md:px-8 h-16 transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-background/95 backdrop-blur-md border-b border-border/60 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 group"
          aria-label="Accueil"
        >
          <img src={logoSrc} alt="SuisseTVb" className="w-9 h-9 object-contain group-hover:opacity-90 transition-opacity" />
          <span className="hidden sm:block text-sm font-semibold tracking-widest text-foreground uppercase group-hover:text-primary transition-colors">
            SuisseTVb
          </span>
        </button>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {user ? (
            <>
              <button onClick={() => navigate("/wheelbet")} className={`hover:text-primary transition-colors ${location === "/wheelbet" ? "text-primary" : ""}`}>Wheelbet</button>
              <button onClick={() => navigate("/fifa")} className={`hover:text-primary transition-colors ${location === "/fifa" ? "text-primary" : ""}`}>FIFA Virtuel</button>
              <button onClick={() => navigate("/profile")} className={`hover:text-primary transition-colors ${location === "/profile" ? "text-primary" : ""}`}>Profil</button>
              {isAdmin && (
                <button onClick={() => navigate("/admin")} className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                  <ShieldCheck className="h-3.5 w-3.5" /> Admin
                </button>
              )}
            </>
          ) : (
            <>
              <button onClick={() => navigate("/")} className={`hover:text-primary transition-colors ${location === "/" ? "text-primary" : ""}`}>Accueil</button>
            </>
          )}
        </nav>

        {/* Right side: CTA + hamburger */}
        <div className="flex items-center gap-3">
          {!user && (
            <Button
              size="sm"
              onClick={() => navigate("/auth")}
              className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-5 text-xs tracking-widest uppercase"
            >
              Connexion
            </Button>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex items-center gap-2 px-3 py-2 border border-border/60 hover:border-primary/60 hover:text-primary bg-card/80 hover:bg-card transition-all text-foreground text-sm font-medium"
          >
            <Menu className="h-4 w-4" />
            <span className="hidden xs:inline text-xs tracking-wider uppercase">Menu</span>
          </button>
        </div>
      </header>

      {/* ── Backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* ── Slide-in Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-card border-l border-border z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <img src={logoSrc} alt="SuisseTVb" className="w-8 h-8 object-contain" />
            <span className="text-sm font-semibold tracking-widest text-foreground uppercase">SuisseTVb</span>
          </div>
          <button
            onClick={closeMenu}
            className="p-1.5 hover:text-primary transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          <MenuItem onClick={() => navigate("/")}>Accueil</MenuItem>

          {user ? (
            <>
              <div className="h-px bg-border/50 my-2" />
              <MenuItem onClick={() => navigate("/wheelbet")}>Wheelbet</MenuItem>
              <MenuItem onClick={() => navigate("/fifa")}>FIFA Virtuel</MenuItem>
              <MenuItem onClick={() => navigate("/profile")}>Mon Profil</MenuItem>
              <MenuItem onClick={() => navigate("/settings")}>Paramètres</MenuItem>

              {isAdmin && (
                <>
                  <div className="h-px bg-border/50 my-2" />
                  <button
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-sm transition-colors text-left"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Tableau de bord Admin
                  </button>
                </>
              )}

              <div className="h-px bg-border/50 my-2 mt-auto" />
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-sm transition-colors text-left"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <div className="h-px bg-border/50 my-2" />
              <button
                onClick={() => navigate("/auth")}
                className="mt-2 px-4 py-3 bg-primary text-primary-foreground text-sm font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors text-center"
              >
                Connexion / Inscription
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

function MenuItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-muted/50 rounded-sm transition-colors text-left"
    >
      {children}
    </button>
  );
}
