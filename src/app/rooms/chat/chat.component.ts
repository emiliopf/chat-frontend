import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as jwt_decode from 'jwt-decode';
import { RoomsService } from '../rooms.service';
import * as Paho from 'paho-mqtt';


export interface Message {
  content: string;
  senderId: number;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class RoomChatComponent implements OnInit, OnDestroy {
  chat: Message[] = [];
  dataSource = new MatTableDataSource<Message>(this.chat);
  displayedColumns: string[] = ['content'];
  decodedToken;
  mqttClient: Paho.Client;

  constructor(
    private roomsService: RoomsService
  ) { }

  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('token'));
    const { idRoom, rol, idUser, alias } = this.decodedToken;

    const topic = `ROOM-${idRoom}/MESSAGES`;
    const clientId = `-${idUser}-CHAT`;

    this.mqttClient = new Paho.Client('ws://emiliodev/ws', clientId);
    this.mqttClient.onConnectionLost = () => {
      console.log('connection lost');
    };

    this.mqttClient.onMessageArrived = (message) => {
      const { payloadString: data } = message;
      console.log(`message arrived: ${data}`);
      this.processMessages(JSON.parse(data));
    };

    const subscribeOptions: Paho.SubscribeOptions = {
      onSuccess: () => {
        console.log('subcription success');
      }
    };

    const options: Paho.ConnectionOptions = {
      timeout: 3,
      keepAliveInterval: 30,
      onSuccess: () => {
        console.log('connection success');
        this.mqttClient.subscribe(topic, subscribeOptions);
      },
      onFailure: (error) => {
        console.log('connection failure');
        console.log(error);
      }
    };

    this.mqttClient.connect(options);
  }

  ngOnDestroy(): void {
    this.mqttClient.disconnect();
  }

  processMessages(message): void {
    console.log('proccessing...');
    const { content, event, senderId } = message;

    this.chat.push({ content, senderId });
    this.dataSource = new MatTableDataSource(this.chat);
  }
}
