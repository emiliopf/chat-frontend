import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import * as jwt_decode from 'jwt-decode';
import { RoomsService } from '../rooms.service';


export interface RoomInfo {
  idUser: string;
  rol: string;
  alias: string;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class RoomInfoComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['rol', 'id', 'alias'];
  dataSource = new MatTableDataSource<RoomInfo>();
  subcription: Subscription;
  decodedToken;
  initialized = false;

  constructor(
    private router: Router,
    private mqqtService: MqttService,
    private roomsService: RoomsService
  ) { }

  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('token'));
    const { idRoom, rol, idUser, alias } = this.decodedToken;

    const topic = `ROOM-${idRoom}/INFO`;
    this.subscribeRoomInfoTopic(topic);

    if (rol === 'owner') {
        const owner = {
          idUser,
          alias,
          rol,
        };

        this.dataSource.data = [owner];
        this.initialized = true;
    }
  }

  ngOnDestroy(): void {
    console.log('bye');
    this.roomsService.logout()
      .subscribe();
    this.subcription.unsubscribe();
  }

  // @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
  //   console.log(event);
  //   const result = confirm('Changes you made may not be saved.');
  //   if (result) {
  //     console.log(result);
  //     this.router.navigate(['/welcome']);
  //     return true;
  //   }
  //   this.router.navigate(['/welcome']);
  //   event.returnValue = false; // stay on same page
  // }

  subscribeRoomInfoTopic(topic: string): void {
    console.log('inside subscribe new topic');
    console.log(topic);
    this.subcription = this.mqqtService.observe(topic)
      .subscribe({
        complete: () => {
          console.log('complete subscribe');
        },
        next: (message: IMqttMessage) => {
          console.log('next subscribe');
          const { rol, idUser: userToken } = this.decodedToken;
          const { content, type , event } = JSON.parse(message.payload.toString());
          const { data } = this.dataSource;

          console.log(message.payload.toString());
          switch (event) {
            case 'USER_JOIN':
              if (rol === 'owner') {
                const { user } = content;
                data.push(user);
                this.dataSource.data = data;
                this.roomsService.sendRoomInfo(data).subscribe();
              }
              break;
            case 'ROOM_UPDATE':
              if (rol !== 'owner') {
                this.dataSource.data = content;
                this.initialized = true;
              }
              break;
            case 'USER_LOGOUT':
              const { idUser } = content;
              const foo = data.filter((elem: RoomInfo) => {
                if (elem.idUser !== idUser) {
                  return true;
                }
                return false;
              });
              console.log(foo);
              this.dataSource.data = foo;
              break;
          }
        },
        error: (err) => {
          console.error('kapachao!');
          console.log(err);
        }
      });
  }

}
