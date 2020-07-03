import { Component } from '@angular/core';
import { UserAuthManagementService } from './core/services/auth/user-auth-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  private userAuthSub: Subscription;

  loggedIn: boolean;

  constructor(private authService: UserAuthManagementService) {}

  ngOnInit(): void {
    this.loggedIn = this.authService.loggedIn;
    this.userAuthSub = this.authService.authRefreshNeeded$.subscribe(() => {
      this.loggedIn = this.authService.loggedIn;
    });
  }

  ngOnDestroy(): void {
    this.userAuthSub.unsubscribe();
  }
}
