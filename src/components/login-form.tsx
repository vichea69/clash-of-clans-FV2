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
import { Link, useNavigate } from "react-router";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onSuccess?: () => void;
  isDialog?: boolean;
  onViewChange?: (view: "signup") => void;
}

export function LoginForm({
  className,
  isDialog,
  onViewChange,
  ...props
}: LoginFormProps) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Submitting login form:", { email: formData.email });
      await signIn(formData.email, formData.password);

      // If we get here, login was successful
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="underline underline-offset-4"
          onClick={() => onViewChange?.("signup")}
        >
          <Link to="/sign-up">Sign up</Link>
        </button>
      </div>
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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    </div>
  );
}
