"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import { CreateFeedbackParams, Interview, Feedback, GetFeedbackByInterviewIdParams, GetLatestInterviewsParams } from "@/types";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem Solving**: Ability to analyze problems and propose solutions.
        - **Cultural Fit**: Alignment with company values and job role.
        - **Confidence and Clarity**: Confidence in responses, engagement, and clarity.
        
        Provide 3-5 strengths and 3-5 areas for improvement.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Provide honest, detailed feedback with specific examples.",
    });

    // Add debugging to see what we're getting
    console.log("Generated object:", JSON.stringify(object, null, 2));

    // Safely access the object properties with fallbacks
    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object?.totalScore || 0,
      categoryScores: {
        communicationSkills: {
          score: object?.communicationSkills?.score || 0,
          comment: object?.communicationSkills?.comment || "No comment available"
        },
        technicalKnowledge: {
          score: object?.technicalKnowledge?.score || 0,
          comment: object?.technicalKnowledge?.comment || "No comment available"
        },
        problemSolving: {
          score: object?.problemSolving?.score || 0,
          comment: object?.problemSolving?.comment || "No comment available"
        },
        culturalFit: {
          score: object?.culturalFit?.score || 0,
          comment: object?.culturalFit?.comment || "No comment available"
        },
        confidenceAndClarity: {
          score: object?.confidenceAndClarity?.score || 0,
          comment: object?.confidenceAndClarity?.comment || "No comment available"
        },
      },
      strengths: Array.isArray(object?.strengths) ? object.strengths : [],
      areasForImprovement: Array.isArray(object?.areasForImprovement) ? object.areasForImprovement : [],
      finalAssessment: object?.finalAssessment || "No assessment available",
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const interviewDoc = await db.collection("interviews").doc(id).get();
    
    if (!interviewDoc.exists) {
      return null;
    }

    const data = interviewDoc.data();
    if (!data) {
      return null;
    }

    return {
      id: interviewDoc.id,
      role: data.role || "",
      level: data.level || "",
      questions: data.questions || [],
      techstack: data.techstack || [],
      createdAt: data.createdAt || "",
      userId: data.userId || "",
      type: data.type || "",
      finalized: data.finalized || false,
    } as Interview;
    
  } catch (error) {
    console.error("Error fetching interview:", error);
    return null;
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}