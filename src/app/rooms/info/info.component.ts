import { Component, OnInit, OnDestroy } from '@angular/core';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import * as jwt_decode from 'jwt-decode';


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
  displayedColumns: string[] = ['rol', 'alias'];
  dataSource = new MatTableDataSource<[RoomInfo]>();
  subcription: Subscription;
  decodedToken;

  constructor(
    private route: ActivatedRoute,
    private mqqtService: MqttService
  ) { }

  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('token'));
    const { idRoom } = this.decodedToken;
    const topic = `O${idRoom}ROOM`;
    console.log(topic);
    this.subscribeRoomTopic(topic);
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  subscribeRoomTopic(topic: string): void {
    console.log('inside subscribe new topic');
    this.subcription = this.mqqtService.observe(topic)
      .subscribe((message: IMqttMessage) => {
        const { data } = this.dataSource;
        data.push(JSON.parse(message.payload.toString()));
        this.dataSource.data = data;
      });
  }

}
