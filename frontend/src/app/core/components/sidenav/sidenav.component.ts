import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserAuthManagementService } from '../../services/auth/user-auth-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  loggedIn: boolean = false;
  private userAuthSub: Subscription;
  constructor(private authService: UserAuthManagementService) {}

  ngOnInit(): void {
    const storedToken = localStorage.getItem('token');
    this.userAuthSub = this.authService.authRefreshNeeded$.subscribe();
  }

  logOut() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.userAuthSub.unsubscribe();
  }
}
