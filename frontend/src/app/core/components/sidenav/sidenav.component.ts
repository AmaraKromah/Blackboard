import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserAuthManagementService } from '../../services/auth/user-auth-management.service';
import { Subscription } from 'rxjs';
import { NbMenuItem, NbMenuService, NbMenuBag } from '@nebular/theme';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  private userAuthSub: Subscription;
  constructor(
    private authService: UserAuthManagementService,
    private menuService: NbMenuService
  ) {}
  items: NbMenuItem[] = [
    {
      title: 'CONTENT',
      group: true,
      hidden: false,
    },
    {
      // title: this.test ? 'Assignments List' : 'bob',
      title: 'Education',
      hidden: false,
      children: [
        {
          title: 'Education List',
          link: '/dashboard/content/educations',
        },
        {
          title: 'Create Education',
          link: '/dashboard/content/educations/create',
        },
      ],
    },
    {
      title: 'Subject',
      hidden: false,
      children: [
        {
          title: 'Subject List',
          link: '/dashboard/content/subjects',
        },
        {
          title: 'Create Subject',
          link: '/dashboard/content/subjects/create',
        },
      ],
    },
    {
      title: 'Assignments',
      hidden: false,
      children: [
        {
          title: 'Assignments List',
          link: '/dashboard/content/assignments',
        },
      ],
    },
    {
      title: 'AUTH',
      group: true,
    },
    {
      title: 'Auth',
      children: [
        {
          title: 'Register',
          link: 'auth/register',
        },
        {
          title: 'Login',
          link: 'auth/login',
        },
        {
          title: 'Request Password',
          link: 'auth/request-password',
        },
        {
          title: 'logout',
          hidden: false,
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.updateMenu(this.authService.loggedIn);
    this.userAuthSub = this.authService.authRefreshNeeded$.subscribe(() => {
      this.updateMenu(this.authService.loggedIn);
    });

    this.menuService
      .onItemClick()
      .pipe(filter(({ tag }) => tag === 'menu'))
      .subscribe((item: NbMenuBag) => {
        const title = item.item.title as String;
        if (title.toLowerCase() === 'logout') this.authService.logout();
      });
  }
  private updateMenu(state: boolean) {
    let authorised: string[] = [
      'education',
      'content',
      'subject',
      'assignments',
    ];
    this.items.forEach((item) => {
      const title = item.title.toLowerCase();
      if (authorised.includes(title)) {
        item.hidden = !state;
      }

      if (title == 'auth' && item.children) {
        //login/logout
        item.children[1].hidden = state;
        item.children[item.children.length - 1].hidden = !state;
      }
    });
  }
  ngOnDestroy(): void {
    this.userAuthSub.unsubscribe();
  }
}
