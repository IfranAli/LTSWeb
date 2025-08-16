import { HttpHeaders } from '@angular/common/http';

export const TOKEN_KEY_NAME = 'Authorization';
export const LOGIN_PAGE_URL = 'login';
export const LANDING_PAGE_URL = 'projects';

export const getHttpHeaders = () => {
  return {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem(TOKEN_KEY_NAME) ?? '',
    }),
    withCredentials: true,
  };
};

export function clearAuthorisationToken() {
  localStorage.removeItem(TOKEN_KEY_NAME);
}

export function getAuthorisationToken() {
  return localStorage.getItem(TOKEN_KEY_NAME);
}

export function setAuthorisationToken(token: string) {
  localStorage.setItem(TOKEN_KEY_NAME, token);
}

export interface ResponseMessage {
  success: boolean;
  message: string;
}
