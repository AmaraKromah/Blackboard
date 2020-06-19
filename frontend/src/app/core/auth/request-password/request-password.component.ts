import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordManagementService } from '../../services/auth/password-management.service';

@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss'],
})
export class RequestPasswordComponent implements OnInit {
  resetForm: FormGroup;

  //validation en error handling doen
  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordManagementService
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      email: ['', Validators.required],
    });
  }

  onSubmit() {
    let email = this.email.value;
    this.passwordService.requestPassword(email);
  }
  get email() {
    return this.resetForm.get('email');
  }
}
