// Maak hier een classe van zodat je parameters kunt meegeven
export const VALIDATIONMESSAGES = {
  name: { required: 'Name is required.', invalidName: 'Invalid name' },
  beginDate: {
    required: 'begin date name is required.',
    nbDatepickerMin: 'Invalid minimum date',
    nbDatepickerParse: 'Invalid date format ',
  },
  endDate: {
    required: 'end date name is required.',
    nbDatepickerMin: 'Invalid minimum date',
    nbDatepickerMax: 'Invalid maximud date',
    nbDatepickerParse: 'Invalid date format ',
  },
  firstName: {
    required: 'First name is required.',
    invalidName: 'Invalid first name',
    minlength: 'First Name must be greater than 3 characters.',
  },
  lastName: {
    required: 'Last name is required.',
    minlength: 'Last Name must be greater than 5 characters.',
    invalidName: 'Invalid last name',
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
