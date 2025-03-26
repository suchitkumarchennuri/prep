"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { signIn, signUp } from "@/lib/actions/auth.action";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { auth } from "@/firebase/client";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const route = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message, {
            style: {
              background: "#ef4444",
              color: "#ffffff",
            },
          });
          return;
        }

        toast.success("Account created successfully", {
          style: {
            background: "#22c55e",
            color: "#ffffff",
          },
        });
        route.push("/sign-in");
      } else {
        const { email, password } = values;
        try {
          const userCredentials = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const idToken = await userCredentials.user.getIdToken();

          if (!idToken) {
            toast.error("Failed to get authentication token", {
              style: {
                background: "#ef4444",
                color: "#ffffff",
              },
            });
            return;
          }
          const result = await signIn({ email, idToken });
          if (!result?.success) {
            toast.error(result?.message, {
              style: {
                background: "#ef4444",
                color: "#ffffff",
              },
            });
            return;
          }
          toast.success("Signed in successfully", {
            style: {
              background: "#22c55e",
              color: "#ffffff",
            },
          });
          route.push("/");
        } catch (error: any) {
          console.error("Sign in error:", error);
          if (error.code === "auth/invalid-credential") {
            toast.error("Invalid email or password", {
              style: {
                background: "#ef4444",
                color: "#ffffff",
              },
            });
          } else if (error.code === "auth/user-not-found") {
            toast.error("No account found with this email", {
              style: {
                background: "#ef4444",
                color: "#ffffff",
              },
            });
          } else if (error.code === "auth/wrong-password") {
            toast.error("Incorrect password", {
              style: {
                background: "#ef4444",
                color: "#ffffff",
              },
            });
          } else {
            toast.error(`Authentication error: ${error.message}`, {
              style: {
                background: "#ef4444",
                color: "#ffffff",
              },
            });
          }
        }
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(`Error: ${error.message}`, {
        style: {
          background: "#ef4444",
          color: "#ffffff",
        },
      });
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10 ">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">Intervue</h2>
        </div>
        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-primary ml-1"
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
