import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as jwt_decode from 'jwt-decode';
import { RoomsService } from '../rooms.service';

import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../users/users.service';
import { stompConfig } from '../../stomp.config';

export interface ChatMessage {
  input: string;
  senderId: number;
  senderAlias: string;
  sameSender: boolean;
  ownMessage: boolean;
  event: string;
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
  @ViewChild('scrollableDiv')scrollableDiv: ElementRef;

  constructor(
    private roomsService: RoomsService,
    private rxStompService: RxStompService,
    private fb: FormBuilder,
    public logoutDialog: MatDialog,
    )
  {}
    
  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('token'));
    const { idRoom, rol, idUser, alias } = this.decodedToken;

    this.chatFormGroup = this.fb.group({
      chatCtrl: ['', Validators.required]
    });

    this.rxStompService.configure(stompConfig);
    this.rxStompService.activate();

    const destination = `/exchange/ROOM-${idRoom}/MESSAGES`;

    this.topicSubscription = this.rxStompService.watch(destination).subscribe((message: Message) => {
      console.log(this.topicSubscription);
      const { body } = message;
      this.processMessage(body);
    });

    this.rxStompService.connected$.subscribe(() => {
      this.sendJoinSuccess();
    });
  }

  ngOnDestroy(): void {
    console.log('onDestroy');
    this.topicSubscription.unsubscribe();
    this.rxStompService.deactivate();
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
      const { senderId: previousSenderId, event: previousEvent } = this.chat[this.chat.length - 1];
      if (previousEvent ==='NEW_MESSAGE' && senderId === previousSenderId) {
        sameSender = true;
      }
    }

    this.chat.push({ input, senderId, senderAlias, sameSender, ownMessage, event });
    this.dataSource = new MatTableDataSource(this.chat);

    // this.scrollableDiv.nativeElement.scrollTop = this.scrollableDiv.nativeElement.scrollHeight;
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

  sendJoinSuccess(): void {
    const { chatCtrl: input } = this.chatFormGroup.value;
    this.roomsService.joinRoomSuccess()
      .subscribe({
        complete: () => {
          console.log('complete send join success');
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

  openDialog() {
    this.logoutDialog.open(LogoutDialogComponent);
  }

}


@Component({
  selector: 'app-chat-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.css'],
})
export class LogoutDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<LogoutDialogComponent>,
    private usersService: UsersService,
  ) {};

  ngOnInit() {};

  logout() {
    this.usersService.logout();
    this.dialogRef.close();
  }

}
