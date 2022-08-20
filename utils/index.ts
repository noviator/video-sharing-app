import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; 

export const createOrGetUser = async (response: any, addUser: any) => {
  // console. log(response)
  const decoded: { name:string , picture:string, sub: string} = jwt_decode(response.credential);
  // console.log(decoded);
  // sub is unique id for user
  const { name, picture, sub } = decoded;

  const user = {
    _id:sub,
    _type:'user',
    userName:name,
    image:picture
  }


  // add user to persistent state (when page is reloaded, user will still be there)  
  addUser(user);

  // api call (api/auth.ts {look url})- post request to backend, user data is taken and creates a new user if not exists
  await axios.post(`${BASE_URL}/api/auth`, user);
};