import { ChevronDown, Copy, Menu, X } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { useEffect, useState, useCallback, memo, useRef } from "react";
import { baseApi, Base as BaseType } from "@/api/baseApi";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Extracted component for better code organization and performance
const ComponentCard = memo(({ component }: { component: BaseType }) => {
  const { user } = useAuth();

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(component.link || window.location.href);
    toast.success("Link copied", {
      duration: 2000,
      position: window.innerWidth < 640 ? "top-center" : "bottom-right",
    });
  }, [component.link]);

  // Check if current user is the creator
  const isCreator = user?.id === component.userId;

  return (
    <div className="group relative rounded-lg border overflow-hidden transition-all duration-200 hover:shadow-md">
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 z-10 
          rounded-md bg-background/90 p-2 sm:p-2.5
          opacity-100 transition-all duration-200
          border border-border/40 shadow-sm
          hover:bg-accent hover:text-accent-foreground
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
      {isCreator && (
        <Badge
          variant="secondary"
          className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 z-10
            text-[10px] sm:text-xs font-medium"
        >
          Your Upload
        </Badge>
      )}
      <a href={component.link} className="block touch-manipulation">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={component.imageUrl || "/placeholder.svg"}
            alt={component.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="p-2 sm:p-3 md:p-4">
          <div className="flex items-center">
            <Avatar.Root className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-full overflow-hidden border flex-shrink-0">
              <Avatar.Image
                src={component.user?.avatar || "/placeholder.svg"}
                alt={component.user?.name || "Unknown"}
                className="h-full w-full object-cover"
              />
              <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-muted text-[10px] sm:text-xs">
                {(component.user?.name || "U")[0]}
              </Avatar.Fallback>
            </Avatar.Root>
            <div className="ml-1.5 sm:ml-2 overflow-hidden flex-1 min-w-0">
              <span className="font-medium text-xs sm:text-sm md:text-base truncate block">
                {component.name}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate block">
                by {isCreator ? "You" : component.user?.name || "Unknown user"}
              </span>
              {component.createdAt && (
                <span className="text-[10px] sm:text-xs text-muted-foreground truncate block">
                  {new Date(component.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
});

ComponentCard.displayName = "ComponentCard";

// Skeleton loader component
const SkeletonCard = memo(() => (
  <div className="rounded-lg border overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200"></div>
    <div className="p-3 sm:p-4">
      <div className="flex items-center">
        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-200 flex-shrink-0"></div>
        <div className="ml-2 flex-1 min-w-0">
          <div className="h-4 w-full max-w-[120px] bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
));

SkeletonCard.displayName = "SkeletonCard";

const sortOptions = [
  { id: "latest", label: "Latest" },
  { id: "recommended", label: "Recommended" },
  { id: "popular", label: "Most Popular" },
  { id: "trending", label: "Trending" },
] as const;

// Add type for sort option
type SortOption = (typeof sortOptions)[number];

const Base = () => {
  const { isAuthenticated, user } = useAuth();
  const [components, setComponents] = useState<BaseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  // Update initial state with explicit type
  const [activeSort, setActiveSort] = useState<SortOption>(sortOptions[0]);

  // Load data using the baseApi
  useEffect(() => {
    const loadBases = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await baseApi.getBases();
        // Sort bases by createdAt in descending order (newest first)
        const sortedBases = response.data.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        setComponents(sortedBases);
      } catch (err) {
        console.error("Error loading bases:", err);
        setError("Failed to load components. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadBases();
  }, []);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(
    () => setMobileMenuOpen((prev) => !prev),
    []
  );

  const handleSortChange = useCallback(
    (option: (typeof sortOptions)[number]) => {
      setActiveSort(option);

      // Sort components based on selected option
      const sortedComponents = [...components].sort((a, b) => {
        switch (option.id) {
          case "latest":
            // Sort by creation date (newest first)
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            );
          case "popular":
            // You can add popularity sorting logic here if you have a popularity metric
            return 0;
          case "trending":
            // You can add trending sorting logic here if you have a trending metric
            return 0;
          default:
            // Default to latest for "recommended" and fallback
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            );
        }
      });

      setComponents(sortedComponents);
    },
    [components]
  );

  // Update handleRetry to include sorting
  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    baseApi
      .getBases()
      .then((response) => {
        const sortedBases = response.data.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        setComponents(sortedBases);
      })
      .catch((err) => {
        console.error("Error retrying bases load:", err);
        setError("Failed to load components. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background">
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-14 sm:h-16 items-center">
          {/* Mobile menu button with larger touch target */}
          <button
            onClick={toggleMobileMenu}
            className="mr-2 md:hidden p-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="#" className="transition-colors hover:text-foreground/80">
              Components
            </a>
            <a href="#" className="transition-colors hover:text-foreground/80">
              Templates
            </a>
            <a href="#" className="transition-colors hover:text-foreground/80">
              Categories
            </a>
            <a href="#" className="transition-colors hover:text-foreground/80">
              Design Engineers
            </a>
            <a href="#" className="transition-colors hover:text-foreground/80">
              Pro
            </a>
          </nav>

          {/* Mobile navigation with improved touch targets */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 top-14 sm:top-16 z-50 bg-background md:hidden overflow-auto"
              onClick={closeMobileMenu} // Close when clicking the backdrop
            >
              <nav className="flex flex-col py-2 border-b shadow-lg">
                <a
                  href="#"
                  className="px-4 py-5 hover:bg-accent active:bg-accent/80"
                  onClick={closeMobileMenu}
                >
                  Components
                </a>
                <a
                  href="#"
                  className="px-4 py-5 hover:bg-accent active:bg-accent/80"
                  onClick={closeMobileMenu}
                >
                  Templates
                </a>
                <a
                  href="#"
                  className="px-4 py-5 hover:bg-accent active:bg-accent/80"
                  onClick={closeMobileMenu}
                >
                  Categories
                </a>
                <a
                  href="#"
                  className="px-4 py-5 hover:bg-accent active:bg-accent/80"
                  onClick={closeMobileMenu}
                >
                  Design Engineers
                </a>
                <a
                  href="#"
                  className="px-4 py-5 hover:bg-accent active:bg-accent/80"
                  onClick={closeMobileMenu}
                >
                  Pro
                </a>
              </nav>
            </div>
          )}

          {/* Sort dropdown with larger touch targets on mobile */}
          <div className="ml-auto">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5
                  text-sm font-medium transition-colors 
                  hover:bg-accent hover:text-accent-foreground 
                  active:bg-accent/80
                  rounded-md"
                >
                  {activeSort.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[8rem] overflow-hidden rounded-md 
                  border bg-popover p-1 text-popover-foreground shadow-md"
                  sideOffset={4}
                  align="end"
                >
                  {sortOptions.map((option) => (
                    <DropdownMenu.Item
                      key={option.id}
                      className="relative flex cursor-default select-none 
                        items-center rounded-sm px-4 py-3.5 text-sm outline-none 
                        transition-colors hover:bg-accent hover:text-accent-foreground
                        active:bg-accent/80"
                      onClick={() => handleSortChange(option)}
                    >
                      {option.label}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </header>

      <main className="container py-4 px-4 sm:px-6 sm:py-6">
        {isAuthenticated ? (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Welcome back, {user?.name}!</p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Sign in to upload your own bases and see which ones you've
              created.
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 sm:p-8 text-center rounded-lg border border-red-200 bg-red-50 text-red-500">
            <p className="font-medium mb-2">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 px-5 py-3 bg-red-100 hover:bg-red-200 active:bg-red-300
                rounded-md text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : components.length === 0 ? (
          <div className="p-6 text-center rounded-lg border bg-background">
            <p className="text-muted-foreground">No components available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {components.map((component) => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Base;
