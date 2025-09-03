import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";
import { NextRequest } from "next/server";
export async function GET() {
    return Response.json({ success: true, data: "THANK YOU!" }, { status: 200 });

}
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('📨 Received request:', body);
        const { type, role, level, techstack, amount, userid, username } = body;
        if (!type || !role || !level || !amount || !userid) {
            console.error('❌ Missing required parameters:', { type, role, level, amount, userid });
            return Response.json({
                success: false,
                error: "Missing required parameters"
            }, { status: 400 });
        }
        console.log('🔧 Generating questions with:', { type, role, level, techstack, amount, username });
        const { text: questions } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare questions for a job interview for ${username || 'the candidate'}..
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
        });
        console.log(questions);
        let parsedQuestions;
        try {
            parsedQuestions = JSON.parse(questions);
        } catch (parseError) {
            console.error('❌ Failed to parse questions as JSON:', parseError);
            console.log('🔄 Falling back to text splitting');
            // Fallback: split by newlines if JSON parsing fails
            parsedQuestions = questions.split('\n')
                .filter(q => q.trim().length > 0)
                .map(q => q.replace(/^\d+\.\s*/, '').trim());
        }
        if (!Array.isArray(parsedQuestions)) {
            console.error('❌ Questions is not an array:', parsedQuestions);
            parsedQuestions = [questions]; // Wrap in array as fallback
        }

        console.log('📝 Final questions array:', parsedQuestions);

        // Process techstack safely
        let processedTechstack = [];
        if (techstack && typeof techstack === 'string') {
            processedTechstack = techstack.split(",")
                .map(tech => tech.trim())
                .filter(tech => tech.length > 0);
        } else if (Array.isArray(techstack)) {
            processedTechstack = techstack;
        }
        console.log('🔧 Processed techstack:', processedTechstack);
        const interview = {
            role,
            type,
            level,
            techstack: processedTechstack,
            questions: parsedQuestions,
            userId: userid,
            finalized: true,
            username: username || 'Unknown',
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        await db.collection('interviews').add(interview);
        return Response.json({
            success: true,
            questions: parsedQuestions
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            error: "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
        }, { status: 500 });

    }
}