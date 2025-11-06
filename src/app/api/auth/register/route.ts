import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    console.log("Checking for existing user with email:", email);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating user...");

    // Verificar si ya existe un customer con este email
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "customer", // Nuevos usuarios son customer por defecto
        customer: existingCustomer
          ? {
              connect: { id: existingCustomer.id },
            }
          : {
              create: {
                name,
                email,
              },
            },
      },
      include: {
        customer: true,
      },
    });

    console.log("User created successfully:", user.id);
    return NextResponse.json(
      { id: user.id, email: user.email },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error details:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 },
    );
  }
}
