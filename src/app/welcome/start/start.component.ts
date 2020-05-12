import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  alias: string;
}

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements OnInit {

  alias: string;
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(StartDialogComponent, {
      height: '230px',
      width: '420px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'app-start-dialog',
  templateUrl: './start-dialog.component.html',
  styleUrls: ['./start-dialog.component.css'],
})
export class StartDialogComponent implements OnInit{
  aliasFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.aliasFormGroup = this.formBuilder.group({
      aliasCtrl: ['', Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      password: ['', Validators.required],
      codeRoom: ['', Validators.required]
    });
  }

}
