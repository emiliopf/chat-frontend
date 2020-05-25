import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../users/users.service';
import { MatStepper } from '@angular/material/stepper';
import { RoomsService } from 'src/app/rooms/rooms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(StartDialogComponent);
  }

  ngOnInit(): void {}
}

@Component({
  selector: 'app-start-dialog',
  templateUrl: './start-dialog.component.html',
  styleUrls: ['./start-dialog.component.css'],
  providers: [UsersService]
})
export class StartDialogComponent implements OnInit{
  @ViewChild('dialogStepper')
  dialogStepper: MatStepper;

  userFormGroup: FormGroup;
  createRoomFormGroup: FormGroup;
  joinRoomFormGroup: FormGroup;

  isUserDone = false;
  roomExist = false;

  constructor(
    private dialogRef: MatDialogRef<StartDialogComponent>,
    private fb: FormBuilder,
    private usersService: UsersService,
    private roomsService: RoomsService,
    private router: Router,
    ) {}

  ngOnInit() {
    this.userFormGroup = this.fb.group({
      aliasCtrl: ['', Validators.required]
    });

    this.createRoomFormGroup = this.fb.group({
      createpasswordCtrl: ['', Validators.required],
    });

    this.joinRoomFormGroup = this.fb.group({
      joinRoomIdCtrl: ['', [Validators.required]],
      joinRoomPasswordCtrl: ['', Validators.required]
    });
  }

  joinRoom() {
    const { joinRoomIdCtrl: idRoom , joinRoomPasswordCtrl: password } = this.joinRoomFormGroup.value;
    return this.roomsService.joinRoom(idRoom, password)
      .subscribe({
        complete: () => {
          console.log('complete join room');
          this.dialogRef.close();
        },
        next: (res: any) => {
          console.log(res);
          this.router.navigate([`/rooms/${res.idRoom}`]);
        },
        error: (err) => {
          console.error('kapachao!');
          console.log(err);
        }
    });
  }


  checkRoom() {
    const { joinRoomIdCtrl: idRoom } = this.joinRoomFormGroup.value;
    return this.roomsService.checkRoom(idRoom)
      .subscribe({
        complete: () => {
          console.log('complete check room');
        },
        next: (res: any) => {
          this.roomExist = true;
          console.log(res);
        },
        error: (err) => {
          console.error('kapachao!');
          console.log(err);
        }
      });
  }

  createRoom() {
    const { createpasswordCtrl: password } = this.createRoomFormGroup.value ;
    return this.roomsService.createRoom({password})
      .subscribe({
        complete: () => {
          console.log('complete crete room');
          this.dialogRef.close();
        },
        next: (res: any) => {
          console.log(res);
          this.router.navigate([`/rooms/${res.id}`]);
        },
        error: (err) => {
          console.error('kapachao!');
          console.log(err);
        }
      });
  }

  createUser() {
    const { aliasCtrl: alias } = this.userFormGroup.value ;
    return this.usersService.createUser({alias})
      .subscribe({
        complete: () => {
          this.isUserDone = true;
          this.dialogStepper.next();
          console.log('finish user creation');
        },
        next: (res) => {
          console.log(res);
          this.usersService.storeToken(res);
        },
        error: (err) => {
          console.error('kapachao!');
          console.log(err);
        }
      });
  }

}
