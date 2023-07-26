import bcrypt from "bcrypt";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
    request: Request
) {
    try {
        
        const { email, name, password} = await request.json();
        
        if (!email || !name || !password) {
            return new NextResponse("Please provide all info", { status: 400 });
        }
        
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
        const user = await prismadb.user.create({
            data: {
                email, name, hashedPassword
            }
        })
        
        return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
        console.log("[REGISTRATION ERROR]", error);
    }
    }