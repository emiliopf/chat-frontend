import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeModule } from './welcome/welcome.module';
import { httpInterceptorProviders } from './http-interceptors/index';
import { RxStompService } from '@stomp/ng2-stompjs';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    WelcomeModule,
  ],
  providers: [
    httpInterceptorProviders,
    RxStompService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
