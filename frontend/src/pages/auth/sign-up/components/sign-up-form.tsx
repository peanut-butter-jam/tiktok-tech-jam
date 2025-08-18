import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { SignUpFormParams } from "../models";
import { supabaseClient } from "@/lib/supabase/supabase-client";
import { toast } from "sonner";

export const SignUpForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormParams>();

  const onSubmit = useCallback(
    async (data: SignUpFormParams) => {
      const { error } = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error("Failed to sign up!");
        return;
      }

      toast.success("Sign up successful!");
      await navigate(from);
    },
    [toast, navigate]
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Sign up with your email, name and password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  disabled={isSubmitting}
                  required
                  {...register("email")}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  disabled={isSubmitting}
                  required
                  {...register("password")}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirmed Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  disabled={isSubmitting}
                  required
                  {...register("confirmPassword")}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Sign Up
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};
