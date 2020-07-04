import { Component, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService, NbMenuBag } from '@nebular/theme';
import { UserAuthManagementService } from '../../services/auth/user-auth-management.service';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  items = [{ title: 'Profile', link: '/auth/login' }, { title: 'Logout' }];
  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private authService: UserAuthManagementService
  ) {}

  ngOnInit(): void {
    this.menuService
      .onItemClick()
      .pipe(filter(({ tag }) => tag === 'user'))
      .subscribe((item: NbMenuBag) => {
        const title = item.item.title as String;
        if (title.toLowerCase() === 'logout') this.authService.logout();
      });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  navigateHome() {
    this.menuService.navigateHome('menu');
    return false;
  }
}
