import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthManagementService } from '../../services/auth/user-auth-management.service';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  private remember: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: UserAuthManagementService,
    private router: Router,
    private _flashMessagesService: FlashMessagesService
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
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.loginService
      .login(login)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.loading = false;
          this._flashMessagesService.show(error, {
            cssClass: 'alert-danger',
            timeout: 2500,
          });
        }
      );
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
