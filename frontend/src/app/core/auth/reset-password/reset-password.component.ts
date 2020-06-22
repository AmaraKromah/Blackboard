import { Component, OnInit } from '@angular/core';
import { PasswordManagementService } from '../../services/auth/password-management.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  resetTokenRecieved: boolean = false;
  private token: string;
  customValidators = CustomValidators;
  formErrors: any = {
    passwordGroup: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private fb: FormBuilder,
    private resetService: PasswordManagementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
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
    this.resetForm.valueChanges.pipe(debounceTime(200)).subscribe(() => {
      CustomValidators.validateAllFormFields(this.resetForm, this.formErrors);
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('token')) {
        this.token = paramMap.get('token');
      }
    });
  }
  onSubmit() {
    let password = this.password.value;
    console.log(password);
    this.resetService.resetPassword(password, this.token);
  }
  getErrors(errors: string): string[] {
    return errors.split('|');
  }
  get password() {
    return this.resetForm.get('passwordGroup.password');
  }
  get confirmPassword() {
    return this.resetForm.get('passwordGroup.confirmPassword');
  }
}
