"use server";

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONEWEEK = 60 * 60 * 24 * 7 * 1000;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // First check if user exists in Firestore
    const userDoc = await db.collection("users").doc(uid).get();

    if (userDoc.exists) {
      console.log("User already exists in Firestore:", uid);
      return {
        success: false,
        message: "User already exists",
      };
    }

    // Create user document in Firestore
    console.log("Creating user document in Firestore:", { uid, name, email });
    await db.collection("users").doc(uid).set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    console.log("Successfully created user document in Firestore");
    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error: unknown) {
    console.error("Firestore error during sign up:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }

    return {
      success: false,
      message: "Failed to create account",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User not found",
      };
    }
    await setSessionCookie(idToken);
    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error: unknown) {
    console.error("Sign in error:", error);
    return {
      success: false,
      message: "Failed to sign in",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONEWEEK,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: ONEWEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function signOut() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return {
      success: true,
      message: "Signed out successfully",
    };
  } catch (error: unknown) {
    console.error("Sign out error:", error);
    return {
      success: false,
      message: "Failed to sign out",
    };
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    return null;
  }
  try {
    const decodedClaims = await auth.verifySessionCookie(session.value, true);
    const userDoc = await db.collection("users").doc(decodedClaims.uid).get();
    if (!userDoc.exists) {
      return null;
    }
    return {
      ...userDoc.data(),
      id: userDoc.id,
    } as User;
  } catch (e: any) {
    console.log(e);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();

  return !!user;
}
