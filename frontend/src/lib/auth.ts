import axios from 'axios';

interface UserData {
  name?: string;
    email?: string;
    password?: string;
}


const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// signup API
export const signupService = async (userData:UserData) => {
  const response = await apiClient.post('/users/signup', userData);
  return response.data;
};
// LoginAPi
export const loginService = async (userData:UserData) => {
        const response = await apiClient.post('/login', userData);
        return response.data;
};

export const chatService = async(user_query:string,token:number)=>{
  const response = await apiClient.post('/users/chat', {user_query}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export const uploadDocumentService = async(documents:FormData,token:number)=>{
  const response = await apiClient.post('/users/upload', {documents}, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  });
  return response.data;
}
// export const uploadDocumentService = async(documents:FormData,email:string,domain:string,token:number)=>{
//   const response = await apiClient.post('/users/upload', {domain,email,documents}, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// }

// export const uploadDocumentService = async(documents:FormData)=>{
//   const response = await apiClient.post('https://httpbin.org/post', {documents});
//   return response.data;
// }
  
  
//   // Free API: Get Random Data for Testing
//   export const getRandomData = async () => {
//     const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
//     return response.data; // Returns an array of random posts
//   };
  

