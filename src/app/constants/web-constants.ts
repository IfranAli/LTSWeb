import {HttpHeaders} from "@angular/common/http";

export const httpHeaders = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  withCredentials: true,
};

export interface ResponseMessage {
  success: boolean,
  message: string
}
