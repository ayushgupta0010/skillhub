import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axiosClient from "@/app/axiosClient";

export async function GET(request) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken").value

  await axiosClient("api/auth/logout", null, accessToken)

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  redirect("/");
}