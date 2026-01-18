import axios from "axios";

const axiosClient = async (path, data, accessToken = null, type="POST") => {

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
    console.log("UHHHHHHHHHH THE ERROR IS \n\n\n\n\n")
    console.log(err.response)
  }
};

export default axiosClient;