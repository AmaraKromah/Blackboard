import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordManagementService } from '../../services/auth/password-management.service';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss'],
})
export class RequestPasswordComponent implements OnInit {
  requestForm: FormGroup;
  customValidators = CustomValidators;
  sendLink: boolean = false;
  formErrors: any = {
    email: '',
  };

  //validation en error handling doen
  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordManagementService
  ) {}

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      email: ['',   [Validators.required, CustomValidators.validateEmail]],
    });
    this.requestForm.valueChanges.pipe(debounceTime(200)).subscribe(() => {
      CustomValidators.validateAllFormFields(this.requestForm, this.formErrors);
    });
  }

  onSubmit() {
    let email = this.email.value;
    //http error validation
    if (this.requestForm.valid) {
      this.passwordService.requestPassword(email);
      this.sendLink = true;
    }
  }
  getErrors(errors: string): string[] {
    return errors.split('|');
  }
  get email() {
    return this.requestForm.get('email');
  }
}
