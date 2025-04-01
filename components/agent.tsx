"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  // Activity monitoring
  const lastActivityTime = useRef<number>(Date.now());
  const activityCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_TIMEOUT = 60000; // 60 seconds of inactivity

  // Maximum interview time (20 minutes)
  const interviewStartTime = useRef<number>(0);
  const MAX_INTERVIEW_TIME = 45 * 60 * 1000; // 45 minutes

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      lastActivityTime.current = Date.now();
      interviewStartTime.current = Date.now();

      // Start monitoring for inactivity
      startActivityMonitoring();
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);

      // Clear the activity monitoring
      if (activityCheckInterval.current) {
        clearInterval(activityCheckInterval.current);
        activityCheckInterval.current = null;
      }
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);

        // Update activity timestamp when we get a message
        lastActivityTime.current = Date.now();

        // Check if the message indicates the interview is concluding
        if (
          message.role === "assistant" &&
          (message.transcript.includes("concludes our interview") ||
            message.transcript.includes("Thank you for your time"))
        ) {
          console.log("Detected interview conclusion message, ending call");
          // Wait a moment to allow for natural conclusion
          setTimeout(() => {
            if (callStatus === CallStatus.ACTIVE) {
              handleDisconnect();
            }
          }, 5000); // 5 seconds
        }
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);

      // Update activity timestamp when speech starts
      lastActivityTime.current = Date.now();
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);

      // Update activity timestamp when speech ends
      lastActivityTime.current = Date.now();
    };

    const onError = (error: Error) => {
      console.log("Error:", error);

      // In case of error, make sure we still try to generate feedback
      if (callStatus === CallStatus.ACTIVE) {
        console.log(
          "Error during active call, ending call to generate feedback"
        );
        handleDisconnect();
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);

      // Clear the activity monitoring
      if (activityCheckInterval.current) {
        clearInterval(activityCheckInterval.current);
        activityCheckInterval.current = null;
      }
    };
  }, [callStatus]);

  // Function to monitor activity and prevent the call from hanging
  const startActivityMonitoring = () => {
    // Clear any existing interval
    if (activityCheckInterval.current) {
      clearInterval(activityCheckInterval.current);
    }

    // Check for inactivity every 10 seconds
    activityCheckInterval.current = setInterval(() => {
      const inactiveTime = Date.now() - lastActivityTime.current;
      const totalInterviewTime = Date.now() - interviewStartTime.current;

      console.log(
        `Time since last activity: ${Math.round(inactiveTime / 1000)} seconds`
      );
      console.log(
        `Total interview time: ${Math.round(
          totalInterviewTime / 60000
        )} minutes`
      );

      // End interview if it's been going on too long
      if (
        totalInterviewTime > MAX_INTERVIEW_TIME &&
        callStatus === CallStatus.ACTIVE
      ) {
        console.log("Maximum interview time reached (20 minutes), ending call");
        handleDisconnect();
        return;
      }

      // If inactive for too long and call is still active
      if (
        inactiveTime > INACTIVITY_TIMEOUT &&
        callStatus === CallStatus.ACTIVE
      ) {
        console.log(
          "Detected long period of inactivity, ending call to generate feedback"
        );
        handleDisconnect();
      }
    }, 10000);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback with", messages.length, "messages");
      console.log("Interview ID:", interviewId);
      console.log("User ID:", userId);

      // Ensure we have messages to generate feedback from
      if (!messages || messages.length < 2) {
        console.error("Not enough messages to generate meaningful feedback");
        router.push("/");
        return;
      }

      try {
        const { success, feedbackId: id } = await createFeedback({
          interviewId: interviewId!,
          userId: userId!,
          transcript: messages,
          feedbackId,
        });

        console.log(
          "Feedback generation result:",
          success ? "Success" : "Failed"
        );
        console.log("Generated feedback ID:", id);

        if (success && id) {
          console.log(
            "Redirecting to feedback page:",
            `/interview/${interviewId}/feedback`
          );
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          console.error("Error saving feedback - success:", success, "id:", id);
          router.push("/");
        }
      } catch (error) {
        console.error("Exception during feedback generation:", error);
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    lastActivityTime.current = Date.now();

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    // Clear the activity monitoring
    if (activityCheckInterval.current) {
      clearInterval(activityCheckInterval.current);
      activityCheckInterval.current = null;
    }

    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
