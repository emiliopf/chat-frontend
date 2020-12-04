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

  // createRoom(data) {
  //   console.log('room service - createRoom');
  //   return this.http.post(`${environment.http_protocol}://${environment.rooms_domain}/create`, data)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  createRoom(data) {
    console.log('room service - createRoom');
    return this.http.post(`${environment.http_protocol}://${environment.rooms_domain}/create`, data);
  }

  roomInfo(data) {
    return this.http.get(`${environment.http_protocol}://${environment.rooms_domain}/${data}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  checkRoom(data) {
    return this.http.get(`${environment.http_protocol}://${environment.rooms_domain}/info/${data}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  joinRoom(data) {
    console.log('room service - joinRoom');
    return this.http.post(`${environment.http_protocol}://${environment.rooms_domain}/login`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  joinRoomSuccess() {
    console.log('join success init');
    return this.http.post(`${environment.http_protocol}://${environment.rooms_domain}/loginsuccess`, {})
    .pipe(
      catchError(this.handleError)
    );
  }

  sendRoomInfo(data: any) {
    console.log('sendRoomInfo');
    console.log(data);
    return this.http.post(`${environment.http_protocol}://${environment.rooms_domain}/sendinfo`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout() {
    console.log('logoutService');
    return this.http.post(`${environment.http_protocol}://${environment.rooms_domain}/logout`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.log('foo');
      console.log(error.toString());
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    console.log(error);
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
