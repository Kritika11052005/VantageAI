import {generateText} from "ai";
import {google} from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";
import {NextRequest} from "next/server";

export async function GET(){
    return Response.json({success:true,data:"THANK YOU!"},{status:200});
}

export async function POST(request:NextRequest){
    try {
        // Parse request body with error handling
        const body = await request.json();
        console.log('📨 Received request:', body);
        
        const {type, role, level, techstack, amount, userid, username} = body;
        
        // Validate required parameters - check for undefined/null, not falsy values
        console.log('🔍 Parameter validation:', {
            type: `"${type}"`, typeExists: type !== undefined && type !== null,
            role: `"${role}"`, roleExists: role !== undefined && role !== null, 
            level: `"${level}"`, levelExists: level !== undefined && level !== null,
            amount: `"${amount}"`, amountExists: amount !== undefined && amount !== null,
            userid: `"${userid}"`, useridExists: userid !== undefined && userid !== null
        });
        
        // Only check for undefined/null, not empty strings
        const missingParams = [];
        if (type === undefined || type === null) missingParams.push('type');
        if (role === undefined || role === null) missingParams.push('role');
        if (level === undefined || level === null) missingParams.push('level');
        if (amount === undefined || amount === null) missingParams.push('amount');
        if (userid === undefined || userid === null) missingParams.push('userid');
        
        if (missingParams.length > 0) {
            console.error('❌ Missing required parameters:', missingParams);
            return Response.json({
                success: false, 
                error: "Missing required parameters: " + missingParams.join(', '),
                receivedParams: body
            }, {status: 400});
        }

        console.log('🔧 Generating questions with:', {type, role, level, techstack, amount, username});

        const {text: questions} = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare questions for a job interview for ${username || 'the candidate'}.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack || 'general'}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3`,
        });
        
        console.log('🤖 Generated questions:', questions);
        
        // Parse questions with error handling
        let parsedQuestions;
        try {
            parsedQuestions = JSON.parse(questions);
            console.log('✅ Successfully parsed questions:', parsedQuestions);
        } catch (parseError) {
            console.error('❌ Failed to parse questions as JSON:', parseError);
            console.log('🔄 Falling back to text splitting');
            // Fallback: split by newlines if JSON parsing fails
            parsedQuestions = questions.split('\n')
                .filter(q => q.trim().length > 0)
                .map(q => q.replace(/^\d+\.\s*/, '').trim()); // Remove numbering
        }

        // Ensure parsedQuestions is an array
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
            questions: parsedQuestions, // Use parsedQuestions, not JSON.parse(questions) again
            userId: userid,
            finalized: true,
            username: username || 'Unknown',
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('💾 Saving interview to database:', interview);
        
        await db.collection('interviews').add(interview);
        
        console.log('✅ Successfully saved interview and returning response');
        
        return Response.json({
            success: true,
            questions: parsedQuestions
        }, {status: 200});

    } catch (error: unknown) {
        console.error('💥 API Error:', error);
        if (error instanceof Error) {
            console.error('📊 Error stack:', error.stack);
        }
        
        return Response.json({
            success: false,
            error: "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
        }, {status: 500});
    }
}