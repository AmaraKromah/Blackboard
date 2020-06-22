import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserAuthManagementService } from '../../services/auth/user-auth-management.service';
import { IUserCreation } from '../../model/auth/userCreation.model';
import { CustomValidators } from '../../../shared/custom-validators';
import {
  NbToastrService,
  NbGlobalPhysicalPosition,
  NbIconConfig,
} from '@nebular/theme';
import { Observable } from 'rxjs';
import { map, take, debounceTime } from 'rxjs/operators';

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
  formErrors: any = {
    firstName: '',
    lastName: '',
    email: '',
    passwordGroup: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private fb: FormBuilder,
    private registerService: UserAuthManagementService,
    private toastrService: NbToastrService
  ) {}
  //todo validaiton spinners
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-z ,.'-]{1,}$/i),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^[a-z ,.'-]{1,}$/i),
        ],
      ],
      email: [
        '',
        [Validators.required, CustomValidators.validateEmail],
        //#async
        CustomValidators.validateEmailExsist(this.registerService),
      ],
      passwordGroup: this.fb.group(
        {
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(6),
              // CustomValidators.validatePassword,
            ],
          ],
          confirmPassword: ['', Validators.required],
        },
        { validator: CustomValidators.validateConfirmPassword }
      ),
    });
    this.registerForm.valueChanges.pipe(debounceTime(200)).subscribe(() => {
      // console.log(this.password.pending);
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
    let response: IUserCreation = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
      password: this.password.value,
      confirmPassword: this.confirmPassword.value,
    };
    if (this.registerForm.valid) {
      if (this.terms == true) {
        this.registerService.registerUser(response);
        //todo catch errors before changing status
        this.sendLink = true;
      } else {
        const iconConfig: NbIconConfig = {
          icon: 'alert-circle-outline',
          pack: 'eva',
        };
        this.toastrService.show('', 'Please accept the terms and conditions', {
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          preventDuplicates: true,
          iconPack: 'eva',
          icon: 'alert-circle-outline',
          status: 'warning',
        });
      }
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
