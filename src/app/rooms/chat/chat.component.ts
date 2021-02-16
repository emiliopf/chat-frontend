import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as jwt_decode from 'jwt-decode';
import { RoomsService } from '../rooms.service';


import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


export interface ChatMessage {
  input: string;
  senderId: number;
  senderAlias: string;
  sameSender: boolean;
  ownMessage: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class RoomChatComponent implements OnInit, OnDestroy {
  chat: ChatMessage[] = [];
  dataSource = new MatTableDataSource<ChatMessage>(this.chat);
  displayedColumns: string[] = ['content'];
  decodedToken;
  private topicSubscription: Subscription;
  chatFormGroup: FormGroup;

  constructor(
    private roomsService: RoomsService,
    private rxStompService: RxStompService,
    private fb: FormBuilder,
    )
  {}

  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('token'));
    const { idRoom, rol, idUser, alias } = this.decodedToken;

    this.chatFormGroup = this.fb.group({
      chatCtrl: ['', Validators.required]
    });

    const destination = `/exchange/ROOM-${idRoom}/MESSAGES`;

    this.topicSubscription = this.rxStompService.watch(destination).subscribe((message: Message) => {
      console.log(this.topicSubscription);
      const { body } = message;
      this.processMessage(body);
    });

  }

  ngOnDestroy(): void {
    this.topicSubscription.unsubscribe();
  }

  processMessage(message): void {
    console.log('proccessing message...');
    const { idUser } = this.decodedToken;
    const { content: { user: { alias: senderAlias }, input }, event, senderId } = JSON.parse(message);

    let sameSender = false;
    let ownMessage = false;

    if (senderId === idUser) {
      ownMessage = true;
    }

    if (this.chat.length > 0) {
      const { senderId: previousSenderId } = this.chat[this.chat.length - 1];
      if (senderId === previousSenderId) {
        sameSender = true;
      }
    }

    this.chat.push({ input, senderId, senderAlias, sameSender, ownMessage });
    this.dataSource = new MatTableDataSource(this.chat);
  }

  sendMessage(): void {
    const { chatCtrl: input } = this.chatFormGroup.value;
    this.roomsService.sendMessage({input})
      .subscribe({
        complete: () => {
          console.log('complete send message');
          this.chatFormGroup.reset();
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
  }

}
