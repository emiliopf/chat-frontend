import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsService } from './rooms.service';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RoomInfoComponent } from './info/info.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [RoomInfoComponent],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    MatTableModule,
    MatIconModule,
  ],
  providers: [RoomsService]
})
export class RoomsModule { }
