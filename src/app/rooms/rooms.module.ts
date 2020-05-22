import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsService } from './rooms.service';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [RoomsService]
})
export class RoomsModule { }
