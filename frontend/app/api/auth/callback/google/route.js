import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import axiosClient from "./app/axiosClient";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  console.log(code)

//   const res = await axiosClient(query, { code });

//   const cookieStore = await cookies();
//   cookieStore.set({
//     name: "accessToken",
//     value: res.data?.google?.access,
//     httpOnly: true,
//     secure: true,
//     path: "/",
//     maxAge: 3600,
//     expires: new Date(Date.now() + 3600),
//     sameSite: "strict",
//   });

//   cookieStore.set({
//     name: "refreshToken",
//     value: res.data?.google?.refresh,
//     httpOnly: true,
//     secure: true,
//     path: "/",
//     maxAge: 7 * 24 * 60 * 60,
//     expires: new Date(Date.now() + 7 * 24 * 60 * 60),
//     sameSite: "strict",
//   });

  redirect(`/?login=true&accessToken=${code}`);
}