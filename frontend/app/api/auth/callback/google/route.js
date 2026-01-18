import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axiosClient from "../../../../axiosClient";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  console.log(`Code: ${code}`)

  try{
    var res = await axiosClient("api/auth/login", {code})

    console.log(res)
  }
  catch(err){
    console.error(err)
  }
  
  const cookieStore = await cookies();
  cookieStore.set({
    name: "accessToken",
    value: res.access,
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 3600,
    expires: new Date(Date.now() + 3600),
    sameSite: "strict",
  });

  cookieStore.set({
    name: "refreshToken",
    value: res.refresh,
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60),
    sameSite: "strict",
  });

  redirect(`/profile?isSignedIn=true&accessToken=${code}`);
}