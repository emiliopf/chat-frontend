import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RoomsService } from '../rooms/rooms.service';
import { Router } from '@angular/router';
import { RxStompService } from '@stomp/ng2-stompjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private roomsService: RoomsService,
    private rxStompService: RxStompService
    ) { }


  createUser(data) {
    return this.http.post(`${environment.http_protocol}://${environment.users_domain}:${environment.users_port}/users/create`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  storeToken(response) {
    const { token } = response;
    localStorage.setItem('token', token);
  }

  clearToken() {
    localStorage.clear();
  }

  logout() {
    this.roomsService.sendLogout()
      .subscribe({
        complete: () => {
          console.log('complete send logout');
        },
        next: (res: any) => {
          console.log(res);
        },
        error: (res) => {
          console.error('kapachao!');
          const {error: message} = res;
          console.error(message);
        }
      });
    this.clearToken();
    this.router.navigate(['/welcome']);
    this.rxStompService.deactivate();
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
