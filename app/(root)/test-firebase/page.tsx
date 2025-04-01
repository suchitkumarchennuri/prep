"use client";

import React, { useState, useEffect } from "react";
import { testFirebaseConnection } from "@/lib/test-firebase";
import { Button } from "@/components/ui/button";

export default function TestFirebasePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const testResult = await testFirebaseConnection();
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        connected: false,
        message: `Unexpected error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  // Automatically run the test when the page loads
  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Firebase Connection Test</h1>

      <div className="mb-6">
        <Button onClick={runTest} disabled={loading}>
          {loading ? "Testing..." : "Run Test Again"}
        </Button>
      </div>

      {result && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Test Results</h2>

          <div className="mb-2">
            <span className="font-semibold">Success:</span>{" "}
            <span
              className={result.success ? "text-green-500" : "text-red-500"}
            >
              {result.success ? "Yes" : "No"}
            </span>
          </div>

          <div className="mb-2">
            <span className="font-semibold">Connected:</span>{" "}
            <span
              className={result.connected ? "text-green-500" : "text-red-500"}
            >
              {result.connected ? "Yes" : "No"}
            </span>
          </div>

          <div className="mb-4">
            <span className="font-semibold">Message:</span>{" "}
            <span>{result.message}</span>
          </div>

          {result.data && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Data (First Item):</h3>
              <pre className="bg-gray-900 p-4 rounded overflow-auto max-h-60">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}

          {result.error && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Error Details:</h3>
              <pre className="bg-gray-900 p-4 rounded overflow-auto max-h-60 text-red-400">
                {JSON.stringify(result.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Common Solutions</h2>

        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <strong>Update Firebase Security Rules:</strong> Make sure your
            Firestore security rules allow the necessary read/write operations.
            <pre className="bg-gray-900 p-4 rounded mt-2 overflow-auto">
              {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // For development only!
    }
  }
}`}
            </pre>
          </li>

          <li>
            <strong>Check Environment Variables:</strong> Ensure all Firebase
            configuration variables are correctly set in your .env.local file.
          </li>

          <li>
            <strong>Authentication:</strong> If your rules require
            authentication, make sure users are properly signed in.
          </li>

          <li>
            <strong>Restart Server:</strong> Try restarting your development
            server to apply any configuration changes.
          </li>
        </ol>
      </div>
    </div>
  );
}
