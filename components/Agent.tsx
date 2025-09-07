"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AgentProps } from "@/types";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import { createFeedback } from "@/lib/actions/general.action";
enum CallStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const ASSISTANT = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

function Agent({  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions }: AgentProps) {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [lastMessage, setLastMessage] = useState<string>("");
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };

        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
      setIsAssistantSpeaking(false);
    };

    const onErr = (e: Error) => console.log("Error ", e);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    /*vapi.on("speech-end", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);*/
    vapi.on("speech-start", onSpeechStart);
vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onErr);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      /*vapi.off("speech-end", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);*/
      vapi.off("speech-start", onSpeechStart);
vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onErr);
    };
  }, []);
  // Determine who is speaking based on the latest message
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.role === "assistant") {
        setIsAssistantSpeaking(true);
        // Auto-stop assistant speaking after a delay (adjust as needed)
        const timer = setTimeout(() => {
          setIsAssistantSpeaking(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
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
    if (!ASSISTANT) {
      console.error("VAPI Assistant ID is not configured");
      return;
    }
    
    setCallStatus(CallStatus.CONNECTING);
    await vapi.start(ASSISTANT, {
      variableValues: {
        username: userName,
        userId: userId,
      },
    });
    }

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMsg = messages[messages.length - 1]?.content;

  const isInactiveOrFinished =
    callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE;

  return (
    <>
      <div className="call-view">
      <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isAssistantSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src={"/user-avatar.png"}
              alt="user-avatar"
              width={540}
              height={540}
              className="object-cover rounded-full size-[120px]"
            />
            {isSpeaking && <span className="animate-speak" />} 

            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages?.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMsg}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {latestMsg}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center items-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="btn-call relative" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            />
            <span>{isInactiveOrFinished ? "Call" : ". . . "}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
}

export default Agent;