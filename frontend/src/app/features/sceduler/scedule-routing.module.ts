import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScedulerComponent } from './sceduler.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  //Scedule
  {
    path: '',
    component: ScedulerComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SceduleRoutingModule {}
