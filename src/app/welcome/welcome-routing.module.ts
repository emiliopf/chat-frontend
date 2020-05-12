import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StartComponent } from './start/start.component';


const routes = [
  { path: 'welcome', component: StartComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WelcomeRoutingModule {}

