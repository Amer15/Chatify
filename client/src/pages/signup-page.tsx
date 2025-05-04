import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BeatLoader } from "react-spinners";
import AuthImagePattern from "../components/login/auth-img-pattern";
import { registerUser } from "../api-services/auth-services";
import { toast } from "sonner";
import Navbar from "../components/common/navbar";

const formSchema = z.object({
  fullName: z
    .string()
    .min(4, "fullName must be at least 4 characters")
    .max(20, "fullName must not exceed 20 characters"),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "password must be at least 8 characters")
    .max(14, "password must not exceed 14 characters"),
});

export type FormData = z.infer<typeof formSchema>;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmitHandler = async (data: FormData) => {
    try {
      setIsSigningUp(true);
      await registerUser(data);
      setIsSigningUp(true);
      reset();
      navigate("/login");
    } catch (error) {
      console.log(error);
      setIsSigningUp(false);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen grid lg:grid-cols-2">
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
                >
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-base-content/60">
                  Get started with your free account
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="space-y-6"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full`}
                    placeholder="John Doe"
                    {...register("fullName")}
                  />
                </div>
                {errors?.fullName && (
                  <p className="text-xs text-red-400 my-2">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className={`input input-bordered w-full`}
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                </div>
                {errors?.email && (
                  <p className="text-xs text-red-400 my-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`input input-bordered w-full`}
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
                {errors?.password && (
                  <p className="text-xs text-red-400 my-2">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <BeatLoader size={8} color="#ffffff" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
        <AuthImagePattern
          title="Join our community"
          subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
        />
      </div>
    </>
  );
};
export default SignUpPage;
