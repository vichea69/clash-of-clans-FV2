import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";
interface SignUpFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onSuccess?: () => void;
  isDialog?: boolean;
  onViewChange?: (view: "login") => void;
}

export function SignUpForm({
  className,
  onSuccess,
  isDialog,
  onViewChange,
  ...props
}: SignUpFormProps) {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signUp(formData.name, formData.email, formData.password);
      toast.success("Account created successfully!");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters long
          </p>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <button
          type="button"
          className="underline underline-offset-4"
          onClick={() => onViewChange?.("login")}
        >
          <Link to="/sign-in">Log in</Link>
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        By clicking Create Account, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );

  if (isDialog) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        {formContent}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    </div>
  );
}
