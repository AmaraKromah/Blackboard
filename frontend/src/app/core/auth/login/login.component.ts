import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthManagementService } from '../../services/auth/user-auth-management.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  private remember: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: UserAuthManagementService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  rememberMe(checked: boolean) {
    this.remember = checked;
  }
  onSubmit(): void {
    let login = {
      email: this.email.value,
      password: this.password.value,
    };

    this.loginService.login(login);
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
