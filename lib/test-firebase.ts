"use client";

import { db } from "@/firebase/client";
import {
  collection,
  getDocs,
  query,
  limit,
  DocumentData,
} from "firebase/firestore";

interface FirebaseTestResult {
  success: boolean;
  connected: boolean;
  message: string;
  data?: DocumentData[];
  error?: unknown;
}

export async function testFirebaseConnection(): Promise<FirebaseTestResult> {
  try {
    // Try to fetch a small number of documents from the interviews collection
    const q = query(collection(db, "interviews"), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: true,
        connected: true,
        message: "Connected to Firebase, but no interviews found",
        data: [],
      };
    }

    const interviews: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      interviews.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      connected: true,
      message: "Successfully connected to Firebase and fetched data",
      data: interviews,
    };
  } catch (error: unknown) {
    console.error("Firebase connection test failed:", error);
    return {
      success: false,
      connected: false,
      message: `Error connecting to Firebase: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error,
    };
  }
}
