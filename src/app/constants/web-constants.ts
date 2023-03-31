import {HttpHeaders} from "@angular/common/http";

export const getHttpHeaders = () => {
  return {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'token': localStorage.getItem('token') ?? '',
    }),
    withCredentials: true,
  }
}


export interface ResponseMessage {
  success: boolean,
  message: string
}
