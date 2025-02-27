import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Moon, Sun, Github, Menu, X, LogOut } from "lucide-react";
import { useTheme } from "./theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { RainbowButton } from "@/components/ui/rainbow-button";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { title: "Home", path: "/" },
    { title: "Base Layouts", path: "/base" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Debug log to check auth state
  useEffect(() => {
    console.log("Auth state:", { user, isAuthenticated });
  }, [user, isAuthenticated]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background/80 dark:border-border/30">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* Logo Section - Visible on all screens */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <svg
              className="h-6 w-6 text-primary dark:text-primary/90"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
              Clash Base Hub
            </span>
          </Link>
          <span className="hidden sm:inline-block text-xs text-foreground/60 dark:text-foreground/70">
            Free CoC Base Layouts
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="transition-colors hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90"
              >
                {item.title}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90"
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard?showBaseUpload=true"
                  className="flex items-center gap-2"
                >
                  <span className="font-medium">Upload Base</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Section - Dark Mode & Menu */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode - Visible on all screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 dark:text-foreground/80 dark:hover:text-foreground dark:hover:bg-accent/50"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="dark:bg-background/95 dark:border-border/30"
            >
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="dark:hover:bg-accent/40"
              >
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="dark:hover:bg-accent/40"
              >
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="dark:hover:bg-accent/40"
              >
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Only Items */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="https://github.com/vichea69"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0 dark:hover:bg-accent/40 dark:text-foreground/80 dark:hover:text-foreground"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>

            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    Hello, {user.name || "User"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="text-sm font-medium transition-colors hover:text-foreground/80"
                  >
                    Login
                  </Link>
                  <Link to="/sign-up">
                    <RainbowButton>Sign Up</RainbowButton>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0 dark:hover:bg-accent/40 dark:text-foreground/80 dark:hover:text-foreground"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 dark:border-border/30 dark:bg-background/95">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}

              {isAuthenticated && user && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard?showBaseUpload=true"
                    className="flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Upload Base</span>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                      New
                    </span>
                  </Link>
                </>
              )}

              <div className="flex flex-col space-y-3 pt-4 border-t border-border/40 dark:border-border/30">
                <Link
                  to="https://github.com/vichea69"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 dark:text-foreground/70 dark:hover:text-foreground/90"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </Link>

                <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-border/40 dark:border-border/30">
                  {isAuthenticated && user ? (
                    <>
                      <span className="text-sm font-medium">
                        Hello, {user.name || "User"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="flex items-center gap-2 justify-center"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/sign-in"
                        className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 dark:hover:bg-accent/40 dark:text-foreground/90"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/sign-up"
                        className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 dark:bg-primary/90 dark:hover:bg-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
