export const VALIDATIONMESSAGES = {
  firstName: {
    required: 'First name is required.',
    pattern: 'Invalid first name',
    minlength: 'First Name must be greater than 3 characters.',
  },
  lastName: {
    required: 'Last name is required.',
    minlength: 'Last Name must be greater than 5 characters.',
    pattern: 'Invalid last name',
  },
  email: {
    required: 'Email is required.',
    validateEmail: 'Invalid email',
    alreadyExist: 'Email already taken please try a new one ',
  },
  passwordGroup: {
    passwordMatchFailed:
      'password and confirm password does not match, please check',
  },
  password: {
    required: 'Password is required.',
    minlength: 'Password  must be greater than 6 characters.',
    noCapitalLetter: 'password must contain atleast one capital letter',
    noSpecialChar: 'password must contain atleast one special character',
    noNumber: 'password must contain atleast one number',
  },
  confirmPassword: {
    required: 'Confirm password is required.',
  },
};
