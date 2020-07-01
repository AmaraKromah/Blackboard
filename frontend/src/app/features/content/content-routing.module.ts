import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEducationComponent } from './education/list-education.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { CreateEducationComponent } from './education/create-education.component';
import { ListSubjectComponent } from './subject/list-subject.component';
import { CreateSubjectComponent } from './subject/create-subject.component';
import { ListAssignmentComponent } from './assignment/list-assignment.component';
import { CreateAssignmentComponent } from './assignment/create-assignment.component';

const routes: Routes = [
  //Educations
  {
    path: 'educations',
    children: [
      {
        path: 'create',
        component: CreateEducationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'edit/:id',
        component: CreateEducationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: '',
        component: ListEducationComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'subjects',
    children: [
      {
        path: 'create',
        component: CreateSubjectComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'edit/:id',
        component: CreateSubjectComponent,
        canActivate: [AuthGuard],
      },
      {
        path: '',
        component: ListSubjectComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
    ],
  },
  //Assignments
  {
    path: 'assignments',
    children: [
      {
        path: 'create',
        component: CreateAssignmentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'edit/:id',
        component: CreateAssignmentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: '',
        component: ListAssignmentComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentRoutingModule {}
