import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private http: HttpClient) { }

  createRoom(data) {
    return this.http.post(`${environment.http_protocol}://${environment.rooms_domain}:${environment.rooms_port}/rooms/create`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  roomInfo(data) {
    return this.http.get(`${environment.http_protocol}://${environment.rooms_domain}:${environment.rooms_port}/rooms/${data}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  checkRoom(data) {
    return this.http.get(`${environment.http_protocol}://${environment.rooms_domain}:${environment.rooms_port}/rooms/info/${data}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  joinRoom(idRoom: number, password: string, alias: string) {
    return this
    .http.post(
      `${environment.http_protocol}://${environment.rooms_domain}:${environment.rooms_port}/rooms/login`,
      {idRoom, password, alias}
    ).pipe(
      catchError(this.handleError)
    );
  }

  joinRoomSuccess() {
    console.log('join success init');
    return this.http.post(`${environment.http_protocol}://${environment.rooms_domain}:${environment.rooms_port}/rooms/loginsuccess`, {})
    .pipe(
      catchError(this.handleError)
    );
  }

  sendRoomInfo(data: any) {
    console.log('sendRoomInfo');
    return this.http.post(`${environment.http_protocol}://${environment.rooms_domain}:${environment.rooms_port}/rooms/sendinfo`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout() {
    console.log('logoutService');
    return this.http.post(`${environment.http_protocol}://${environment.rooms_domain}:${environment.rooms_port}/rooms/logout`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
