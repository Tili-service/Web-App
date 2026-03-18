"use server";

import { cookies } from "next/headers";

export async function getAccount() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${process.env.BACKEND_GO}/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch account");
  }

  return res.json();
}
