import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ListEducationComponent } from './features/education/list-education.component';
import { CreateEducationComponent } from './features/education/create-education.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { ListSubjectComponent } from './features/subject/list-subject.component';
import { CreateSubjectComponent } from './features/subject/create-subject.component';
import { ListAssignmentComponent } from './features/assignment/list-assignment.component';
import { CreateAssignmentComponent } from './features/assignment/create-assignment.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { RequestPasswordComponent } from './core/auth/request-password/request-password.component';
import { ResetPasswordComponent } from './core/auth/reset-password/reset-password.component';
import { ComfirmRegistrationComponent } from './core/auth/register/comfirm-registration.component';
import { AuthGuard } from './core/guards/auth.guard';

//todo veranderen canActivate naar canActivateChild wanneer alles apart staat want dit hoort bij de dashboard
const routes: Routes = [
  { path: 'dashboard', component: HomeComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  //Educations
  {
    path: 'dashboard/educations',
    component: ListEducationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/educations/create',
    component: CreateEducationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/educations/edit/:id',
    component: CreateEducationComponent,
    canActivate: [AuthGuard],
  },
  //subjects
  {
    path: 'dashboard/subjects',
    component: ListSubjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/subjects/create',
    component: CreateSubjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/subjects/edit/:id',
    component: CreateSubjectComponent,
    canActivate: [AuthGuard],
  },

  //Assignments
  {
    path: 'dashboard/assignments',
    component: ListAssignmentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/assignments/create',
    component: CreateAssignmentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/assignments/edit/:id',
    component: CreateAssignmentComponent,
    canActivate: [AuthGuard],
  },

  // AUTH
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/confirmation/:token', component: ComfirmRegistrationComponent },
  { path: 'auth/request-password', component: RequestPasswordComponent },
  { path: 'auth/reset-password/:token', component: ResetPasswordComponent },

  //errors
  { path: 'error_500', component: ServerErrorComponent },
  { path: 'error_404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
