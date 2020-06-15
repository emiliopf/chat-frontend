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

    const topic = `ROOM-${idRoom}/INFO`;
    const clientId = `myclientid_${idUser}`;

    this.mqttClient = new Paho.Client('localhost', 15675, '/ws', clientId);
    this.mqttClient.onConnectionLost = () => {
      console.log('connection lost');
    };
    this.mqttClient.onMessageArrived = (message) => {
      console.log('message arrived');
      console.log(message);
      const { payloadString: data } = message;
      this.processMessages(JSON.parse(data));
    };

    const subscribeOptions: Paho.SubscribeOptions = {
      onSuccess: () => {
        console.log('subcription success');
        this.roomsService.joinRoomSuccess().subscribe();
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

    switch (event) {
      case ('USER_JOIN'): {
        const { user } = content;
        const foo = this.dataSource.data;
        foo.push(user);
        console.log(foo);
        this.dataSource.data = foo;
      }
    }
  }
}
