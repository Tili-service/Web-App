"use server";

import { cookies } from "next/headers";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return false;
  }

  try {
    const res = await fetch(`${process.env.BACKEND_GO}/account`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      return true;
    }
  } catch (error) {
    console.error("Auth check failed", error);
  }

  return false;
}
