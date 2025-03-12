export interface Messages{
    message?:string | undefined,
    text?:string | undefined,
    isUser?: boolean | undefined,
    isLoading?: boolean | undefined
}
    export interface UserInfo {
        id?: string | undefined |number
        name?: string | undefined
        email: string | undefined
        accessToken: string | number | undefined
    }
  
export interface Document{
    id: string,
    status: 1 | 0,
    file_name: string,
    category_id: string,
    table_name: string,
    uploaded_at: string
}