import { Component, OnInit } from '@angular/core';
import { PasswordManagementService } from '../../services/auth/password-management.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  resetTokenRecieved: boolean = false;

  private token: string;

  constructor(
    private fb: FormBuilder,
    private resetService: PasswordManagementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      password: ['', Validators.required],
      comfirmPassword: ['', Validators.required],
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('token')) {
        this.token = paramMap.get('token');
        this.resetService.getResetToken(this.token).subscribe((data) => {
          console.log('data', data);
          // this.statusCode = data.status;
        });
      }
    });
  }
  onSubmit() {
    let password = this.password.value;
    this.resetService.resetPassword(password, this.token);
  }

  get password() {
    return this.resetForm.get('password');
  }
  get comfirmPassword() {
    return this.resetForm.get('comfirmPassword');
  }
}
