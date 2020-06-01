import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './welcome/start/start.component';
import { MqttExampleComponent } from './mqtt-example/mqtt-example.component';
import { RoomInfoComponent } from './rooms/info/info.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: StartComponent },
  // { path: 'rooms/:alias', component: RoomInfoComponent },
  { path: 'play', component: RoomInfoComponent },
  { path: 'mqtt-example', component: MqttExampleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
