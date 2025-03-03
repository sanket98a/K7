export interface Messages{
    message?:string | undefined,
    text?:string | undefined,
    isUser?: boolean | undefined,
    isLoading?: boolean | undefined
}
export interface UserInfo {
    id?: string
    name?: string
    email: string | undefined
    accessToken: string | number | undefined
  }
  