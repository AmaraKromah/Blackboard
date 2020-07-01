import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEducationComponent } from './education/list-education.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { CreateEducationComponent } from './education/create-education.component';

const routes: Routes = [
  //Educations
  {
    path: 'educations',
    component: ListEducationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'educations/create',
    component: CreateEducationComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentRoutingModule {}
