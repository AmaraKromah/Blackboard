import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserAuthManagementService } from '../../services/auth/user-auth-management.service';
import { IUserCreation } from '../../model/auth/userCreation.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  sendLink: boolean = false;
  private terms: boolean;

  constructor(
    private fb: FormBuilder,
    private registerService: UserAuthManagementService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      comfirmPassword: ['', Validators.required],
    });
  }

  termofService(checked: boolean): void {
    this.terms = checked;
  }
  // confirm_password
  onSubmit(): void {
    let response = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
      password: this.password.value,
      comfirmPassword: this.comfirmPassword.value,
    };

    if (this.terms == true) {
      this.registerService.registerUser(response);
      this.sendLink = true;
    } else {
      console.log('Please comfirm the terms');
    }
  }
  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get comfirmPassword() {
    return this.registerForm.get('comfirmPassword');
  }
}
