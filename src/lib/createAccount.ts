"use server";

export default async function createAccount(data : {email: string, name: string, password: string}) {
    const res = await fetch(`${process.env.BACKEND_GO}/account`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    )
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create account");
    }
    return { success: true };
}