import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as jwt_decode from 'jwt-decode';
import { RoomsService } from '../rooms.service';
import * as Paho from 'paho-mqtt';


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
  decodedToken;
  initialized = false;
  mqttClient: Paho.Client;

  constructor(
    private roomsService: RoomsService
  ) { }

  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('token'));
    const { idRoom, rol, idUser, alias } = this.decodedToken;

    const topic = `ROOM-${idRoom}`;
    const clientId = `-${idUser}-`;

    this.mqttClient = new Paho.Client('ws://emiliodev/ws', clientId);
    this.mqttClient.onConnectionLost = () => {
      console.log('connection lost');
    };
    this.mqttClient.onMessageArrived = (message) => {
      console.log('message arrived d');
      console.log(message);
      const { payloadString: data } = message;
      this.processMessages(JSON.parse(data));
    };

    const subscribeOptions: Paho.SubscribeOptions = {
      onSuccess: () => {
        console.log('subcription success d');
        if (rol !== 'owner') {
          this.roomsService.joinRoomSuccess().subscribe();
        } else {
          this.dataSource.data = [{idUser, alias, rol}];
        }
      }
    };

    const options: Paho.ConnectionOptions = {
      timeout: 3,
      keepAliveInterval: 30,
      onSuccess: () => {
        console.log('connection success');
        this.mqttClient.subscribe(topic, subscribeOptions);
        this.initialized = true;
      },
      onFailure: (message) => {
        console.log('connection failure');
        console.log(message);
      }
    };

    console.log('foo');
    this.mqttClient.connect(options);
  }

  ngOnDestroy(): void {
    console.log('bye');
    this.mqttClient.disconnect();
    this.roomsService.logout()
      .subscribe();
  }

  processMessages(message): void {
    console.log('proccessing');
    console.log(message);
    const { content, event } = message;
    const { rol } = this.decodedToken;

    switch (event) {
      case ('USER_JOIN'): {
        if (rol === 'owner') {
          const { user } = content;
          const { data: newData } = this.dataSource;
          newData.push(user);
          this.dataSource.data = newData;
          this.roomsService.sendRoomInfo(newData);
        }
        break;
      }
      case ('REFRESH'): {
        if (rol !== 'owner') {
          this.dataSource.data = content;
        }
        break;
      }
      case ('USER_LEFT'): {
        console.log('user left');
        const { idUser: userLeft } = content;
        const { data } = this.dataSource;

        const filteredData = data.filter((user) => {
          return user.idUser !== userLeft;
        });

        this.dataSource.data = filteredData;
        break;
      }
    }
  }
}
