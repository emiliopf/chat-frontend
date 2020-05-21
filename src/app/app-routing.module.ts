import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MqttExampleComponent } from './mqtt-example/mqtt-example.component';


const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'mqtt-example', component: MqttExampleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
