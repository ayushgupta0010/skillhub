import axios from "axios";
import { cookies } from "next/headers";

const axiosClient = async (path, data, token = null, type="POST") => {
  const accessToken = (await cookies()).get("accessToken")?.value || token;
  try{
    if(type == "POST"){
      var res = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + path,
        data,
        {
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
        },
      );
    }
    else if (type == "GET"){
      var res = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + path,
        {
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
        },
      );
    }
  
    return res.data;
  }
  catch(err){
    console.log("what do u want from me dude")
    console.log("UHHHHHHHHHH THE ERROR IS \n\n\n\n\n")
    console.log(err.response)
  }
};

export default axiosClient;