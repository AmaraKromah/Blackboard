import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { ListSubjectComponent } from './features/content/subject/list-subject.component';
import { CreateSubjectComponent } from './features/content/subject/create-subject.component';
import { ListAssignmentComponent } from './features/content/assignment/list-assignment.component';
import { CreateAssignmentComponent } from './features/content/assignment/create-assignment.component';
import { AuthGuard } from './core/guards/auth.guard';
import { TextEditorComponent } from './shared/components/text-editor.component';

//todo veranderen canActivate naar canActivateChild wanneer alles apart staat want dit hoort bij de dashboard
const routes: Routes = [
  { path: 'dashboard', component: HomeComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  //editor testing
  { path: 'dashboard/editor', component: TextEditorComponent },
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
  {
    // 'dashboard/content/educations',
    path: 'dashboard/content',
    loadChildren: './features/content/content.module#ContentModule',
  },
  { path: 'auth', loadChildren: './core/auth/auth.module#AuthModule' },

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
