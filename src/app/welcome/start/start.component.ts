import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../users/users.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(StartDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
  @ViewChild('dialogStepper') dialogStepper: MatStepper;
  userFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isUserDone = false;

  constructor(private fb: FormBuilder, private usersService: UsersService) {}

  ngOnInit() {
    this.userFormGroup = this.fb.group({
      aliasCtrl: ['', Validators.required]
    });

    this.secondFormGroup = this.fb.group({
      password: ['', Validators.required],
      codeRoom: ['', Validators.required]
    });
  }

  createUser() {
    const { aliasCtrl: alias } = this.userFormGroup.value ;
    return this.usersService.createUser({alias})
      .subscribe({
        complete: () => {
          console.log('finish user creation');
        },
        next: (res) => {
          console.log(res);
          this.isUserDone = true;
          this.dialogStepper.next();
        },
        error: (err) => {
          console.error('kapachao!');
          console.log(err);
        }
      });
  }

}
