import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserAuthManagementService } from '../../services/auth/user-auth-management.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-comfirm-registration',
  templateUrl: './comfirm-registration.component.html',
  styleUrls: ['./comfirm-registration.component.scss'],
})
export class ComfirmRegistrationComponent implements OnInit {
  statusCode: number;
  message: string;
  constructor(
    private comfirmService: UserAuthManagementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('token')) {
        let token = paramMap.get('token');
        this.comfirmService.confirmRegistration(token).subscribe((data) => {
          this.statusCode = data.status;
        });
      }
    });
  }
}
