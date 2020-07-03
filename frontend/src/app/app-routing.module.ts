import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MainComponent } from './pages/main/main.component';

//todo veranderen canActivate naar canActivateChild wanneer alles apart staat want dit hoort bij de dashboard
const routes: Routes = [
  {
    path: 'dashboard',
    children: [
      {
        // 'dashboard/content/',
        path: 'content',
        loadChildren: () =>
          import('./features/content/content.module').then(
            (m) => m.ContentModule
          ),
      },
      // 'dashboard/settings/',
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
    ],
  },
  // AUTH
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.module').then((m) => m.AuthModule),
  },
  { path: '', component: MainComponent },

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
