import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
  decodedToken;
  initialized = false;

  constructor(
    private roomsService: RoomsService
  ) { }

  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('token'));
    const { idRoom, rol, idUser, alias } = this.decodedToken;

    const topic = `ROOM-${idRoom}`;
    const clientId = `-${idUser}-`;
  }

  ngOnDestroy(): void {
  }

}
