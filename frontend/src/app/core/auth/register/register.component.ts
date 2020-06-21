import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserAuthManagementService } from '../../services/auth/user-auth-management.service';
import { IUserCreation } from '../../model/auth/userCreation.model';
import { CustomValidators } from '../../../shared/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  sendLink: boolean = false;
  terms: boolean = false;
  customValidators = CustomValidators;
  formErrors = {
    firstName: '',
    lastName: '',
    email: '',
    passwordGroup: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private fb: FormBuilder,
    private registerService: UserAuthManagementService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-z ,.'-]{2,}$/i),
        ],
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern(/^[a-z ,.'-]{3,}$/i)],
      ],
      email: ['', [Validators.required]],
      passwordGroup: this.fb.group(
        {
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(6),
              CustomValidators.validatePassword,
            ],
          ],
          confirmPassword: ['', Validators.required],
        },
        { validator: CustomValidators.validateConfirmPassword }
      ),
    });
    this.registerForm.valueChanges.subscribe(() => {
      CustomValidators.validateAllFormFields(
        this.registerForm,
        this.formErrors
      );
    });
  }
  getErrors(errors: string): string[] {
    return errors.split('|');
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
      confirmPassword: this.confirmPassword.value,
    };
    if (this.terms == true && this.registerForm.valid) {
      //   this.registerService.registerUser(response);
      //   this.sendLink = true;
      // } else {
      //   console.log('Please comfirm the terms');
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
  get passwordGroup() {
    return this.registerForm.get('passwordGroup');
  }
  get password() {
    return this.registerForm.get('passwordGroup.password');
  }
  get confirmPassword() {
    return this.registerForm.get('passwordGroup.confirmPassword');
  }
}
