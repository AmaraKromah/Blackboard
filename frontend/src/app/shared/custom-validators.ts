import {
  FormControl,
  FormGroup,
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { VALIDATIONMESSAGES } from './validation-messages';
import { UserAuthManagementService } from '../core/services/auth/user-auth-management.service';
import { debounceTime, take, map, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class CustomValidators {
  static validateEmailExsist(
    service: UserAuthManagementService
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return service.checkEmail(control.value).pipe(
        debounceTime(300),
        take(1),
        map((result: boolean) => (result ? { alreadyExist: true } : null))
      );
    };
  }

  static validateEmail(control: FormControl) {
    const regExp = new RegExp(
      // tslint:disable-next-line: max-line-length
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (control.value)
      if (regExp.test(control.value)) {
        return null;
      } else {
        return { validateEmail: true };
      }
  }

  static validatePassword(control: AbstractControl): { [key: string]: any } {
    const password = control.value;

    if (password) {
      if (!String(password).match(/^(?=.*[A-Z]).*$/)) {
        return { noCapitalLetter: true };
      }
      if (!String(password).match(/^(?=.*[-+_!@#$%^&*.,?]).*$/)) {
        return { noSpecialChar: true };
      }
      if (!String(password).match(/^(?=.*[0-9]).*$/)) {
        return { noNumber: true };
      }
    }
    return null;
  }
  static validateConfirmPassword(control: FormGroup): { [key: string]: any } {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password.value == confirmPassword.value || confirmPassword.pristine
      ? null
      : { passwordMatchFailed: true };
  }
  static validateName(control: AbstractControl) {
    const name = control.value;

    if (name === null || name === '') {
      return null;
    }

    if (!name.toString().match(/^[a-z ,.'-]{1,}$/i)) {
      return { invalidName: true };
    }

    return null;
  }
  static validateNumbersOnly(control: AbstractControl) {
    const val = control.value;

    if (val === null || val === '') {
      return null;
    }

    if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) {
      return { onlyNumber: true };
    }

    return null;
  }

  static validatNoWhitespace(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  static validateBlankSpaceInputNotValid(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    return null;
  }

  static validateAllFormFields(group: FormGroup, formErrors: object): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      formErrors[key] = '';
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)
      ) {
        const messages = VALIDATIONMESSAGES[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            // console.log(errorKey);
            formErrors[key] += messages[errorKey] + '|';
            // console.log(this.formErrors);
          }
        }
      }
      if (abstractControl instanceof FormGroup)
        this.validateAllFormFields(abstractControl, formErrors);
    });
  }
  static markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
