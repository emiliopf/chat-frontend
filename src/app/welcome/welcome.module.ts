import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';

import { FlexLayoutModule } from '@angular/flex-layout';

import { StartComponent, StartDialogComponent } from './start/start.component';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';


@NgModule({
  declarations: [StartComponent, StartDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatTabsModule,
    FlexLayoutModule,
    WelcomeRoutingModule,
    UsersModule,
    RoomsModule
  ]
})
export class WelcomeModule { }
