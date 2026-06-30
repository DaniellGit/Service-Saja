import { NextResponse } from "next/server";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7
};

export async function POST(request: Request) {
  const body = (await request.json()) as {
    accessToken?: string;
    refreshToken?: string;
  };

  if (!body.accessToken || !body.refreshToken) {
    return NextResponse.json({ error: "Missing session tokens" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("service-saja-access-token", body.accessToken, cookieOptions);
  response.cookies.set("service-saja-refresh-token", body.refreshToken, cookieOptions);

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("service-saja-access-token", "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set("service-saja-refresh-token", "", { ...cookieOptions, maxAge: 0 });

  return response;
}
