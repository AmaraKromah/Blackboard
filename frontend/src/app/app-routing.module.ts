import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ListEducationComponent } from './features/education/list-education.component';
import { CreateEducationComponent } from './features/education/create-education.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';


const routes: Routes = [

   
  {path:'dashboard', component: HomeComponent},
  {path:'dashboard/educations', component: ListEducationComponent},
  {path:'dashboard/educations/create', component: CreateEducationComponent},
  {path:'dashboard/educations/edit/:id', component: CreateEducationComponent},
  {path:'', redirectTo: "dashboard", pathMatch:'full'},
  //errors
  {path:'error_500', component: ServerErrorComponent},
  {path:'error_404', component: NotFoundComponent},
  {path:'**', component:NotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
