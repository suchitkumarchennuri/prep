"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FeedbackData {
  id: string;
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface InterviewData {
  id: string;
  role: string;
  type: string;
  level: string;
  techstack: string[];
}

export default function FeedbackPage() {
  const params = useParams();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;

      try {
        // First fetch the interview data
        const interviewDocRef = doc(db, "interviews", params.id as string);
        const interviewDocSnap = await getDoc(interviewDocRef);

        if (interviewDocSnap.exists()) {
          setInterview({
            id: interviewDocSnap.id,
            ...interviewDocSnap.data(),
          } as InterviewData);
        }

        // Try to fetch feedback by document ID first (direct match)
        const feedbackRef = doc(db, "feedback", params.id as string);
        const feedbackSnap = await getDoc(feedbackRef);

        if (feedbackSnap.exists()) {
          console.log("Found feedback by direct ID match");
          setFeedback({
            id: feedbackSnap.id,
            ...feedbackSnap.data(),
          } as FeedbackData);
        } else {
          // If not found, try to find feedback by interviewId field in a query
          console.log("Direct ID match not found, searching by interviewId");
          const feedbackQuery = query(
            collection(db, "feedback"),
            where("interviewId", "==", params.id),
            limit(1)
          );

          const querySnapshot = await getDocs(feedbackQuery);

          if (!querySnapshot.empty) {
            console.log("Found feedback by interviewId query");
            const feedbackDoc = querySnapshot.docs[0];
            setFeedback({
              id: feedbackDoc.id,
              ...feedbackDoc.data(),
            } as FeedbackData);
          } else {
            console.log("No feedback found for this interview");
          }
        }
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">Loading feedback...</div>
    );
  }

  if (!feedback || !interview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Feedback not found</h1>
        <p>The feedback for this interview is not available.</p>
        <Button className="mt-4" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  // Map category scores to categories with names
  const scoreCategories = feedback.categoryScores.map((category) => ({
    name: category.name,
    data: {
      score: category.score,
      analysis: category.comment,
    },
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {interview.role} Interview Feedback
          </h1>
          <p className="text-lg">
            Type: {interview.type} | Level: {interview.level}
          </p>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold">{feedback.totalScore}</div>
          <div className="text-lg">Overall Score</div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Final Assessment</h2>
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-lg">{feedback.finalAssessment}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {scoreCategories.map((category) => (
          <div key={category.name} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{category.name}</h3>
              <div className="text-2xl font-bold">
                {category.data.score}/100
              </div>
            </div>
            <p>{category.data.analysis}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Interview Transcript</h2>
        <div className="bg-gray-800 rounded-lg p-6">
          {feedback.transcript &&
            feedback.transcript.map((message, index) => (
              <div key={index} className="mb-4">
                <div className="font-semibold mb-1">
                  {message.role === "assistant" ? "AI Interviewer" : "You"}:
                </div>
                <p>{message.content}</p>
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild>
          <Link href="/interview">New Interview</Link>
        </Button>
      </div>
    </div>
  );
}
