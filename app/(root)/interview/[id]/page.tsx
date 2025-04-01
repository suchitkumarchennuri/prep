"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Agent from "@/components/agent";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

interface InterviewData {
  id: string;
  questions: string[];
  role: string;
  type: string;
  level: string;
  techstack: string[];
  userId: string;
  finalized: boolean;
}

export default function InterviewPage() {
  const params = useParams();
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      if (!params.id) return;

      try {
        const docRef = doc(db, "interviews", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInterview({
            id: docSnap.id,
            ...docSnap.data(),
          } as InterviewData);
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [params.id]);

  if (loading) {
    return <div>Loading interview...</div>;
  }

  if (!interview) {
    return <div>Interview not found</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{interview.role} Interview</h2>
        <p>Type: {interview.type}</p>
        <p>Level: {interview.level}</p>
      </div>

      <Agent
        userName="Guest"
        userId=""
        interviewId={interview.id}
        type="interview"
        questions={interview.questions}
      />
    </div>
  );
}
