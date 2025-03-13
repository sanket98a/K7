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

export const chatService = async(user_query:string,response_lang:string,token:string|number|undefined)=>{
  const response = await apiClient.post('/users/chat', {user_query,response_lang}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export const mathChatService = async(user_query:string,token:string|number|undefined)=>{
  const response = await apiClient.post('/users/math_chat', {user_query}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export const tabularChatService = async(user_query:string,table_name:string,token:string|number|undefined)=>{
  const response = await apiClient.post('/users/tabular_chat', {user_query,table_name}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export const documentFetchService = async(email_id:string,token:string|number|undefined)=>{
  const response = await apiClient.post('/users/chatmetadata', {email_id}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export const tabularFetchService = async(email_id:string,token:string|number|undefined)=>{
  const response = await apiClient.post('/users/tabulartmetadata', {email_id}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export const tabularDropDownFetchService = async(email_id:string,token:string|number|undefined)=>{
  const response = await apiClient.post('/users/get_table_name', {email_id}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export const deleteDocumentService = async(id:string,token:string|number|undefined)=>{
  const response = await apiClient.delete('/users/delete_chatmetadata',{
    data:{id},
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export const deleteTabularService = async(id:string,token:string|number|undefined)=>{
  const response = await apiClient.delete('/users/delete_tabularmetadata',{
    data:{id},
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export const uploadDocumentService = async(documents:FormData,token:string|number|undefined)=>{
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
  

