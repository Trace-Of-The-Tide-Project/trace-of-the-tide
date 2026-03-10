import { NextResponse } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://backend-phd7.onrender.com"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    console.error("Login proxy error:", err)
    return NextResponse.json({ message: "Unable to reach the server." }, { status: 502 })
  }
}
