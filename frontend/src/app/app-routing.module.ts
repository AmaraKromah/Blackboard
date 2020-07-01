import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { AuthGuard } from './core/guards/auth.guard';

//todo veranderen canActivate naar canActivateChild wanneer alles apart staat want dit hoort bij de dashboard
const routes: Routes = [
  { path: 'dashboard', component: HomeComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    // 'dashboard/content/educations',
    path: 'dashboard/content',
    loadChildren: () =>
      import('./features/content/content.module').then((m) => m.ContentModule),
  },
  // AUTH
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.module').then((m) => m.AuthModule),
  },

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
