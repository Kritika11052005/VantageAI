'use server'

import { db } from "@/firebase/admin"
import { success } from "zod"

import { auth } from "@/firebase/admin"

import { cookies } from "next/headers"
// Session duration (1 week)
const ONE_WEEK=60*60*24*7
export async function signUp(params:SignUpParams){
    const {uid,name,email}=params
    try {
        const userRecord=await db.collection('users').doc(uid).get();
        if(userRecord.exists){
            return{
                success:false,
                message:'User already exists . Please SignIn instead'
            }
        }
        await db.collection('users').doc(uid).set({
            name,email
        })
        return {
            success:true,
            message:'Account created Successfully .Please Sign-In '
        }
    } catch (error:unknown) {
        
        console.error('Error creating a user',error)
        if((error as {code?: string}).code==='auth/email-already-exist'){
            return{
                success:false,
                message:'This is email is already in use.'
            }


        }
        return{
            success:false,
            message:'Failed to create an account'
        }
    }
}

// Set session cookie
export async function setSessionCookie(idToken:string){
    const cookieStore=await cookies();
    // Create session cookie
    const sessionCookie=await auth.createSessionCookie(idToken,{
        expiresIn:ONE_WEEK*1000,
    })
  // Set cookie in the browser
    cookieStore.set('session',sessionCookie,{
        maxAge:ONE_WEEK,
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        path:'/',
        sameSite:'lax'
    })
}

export async function signIn(params:SignInParams){
    const {email,idToken}=params
    try {
        const userRecord=await auth.getUserByEmail(email);
        if(!userRecord){
            return{
                success:false,
                message:'User does not exist. Create Account'
            }
        }
        await setSessionCookie(idToken);
    } catch (error) {
        console.log(error);
        return{
            success:false,
            message:'Failed to log into an account'
        }
    }
}

