import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { Education } from 'src/app/core/model/education.model';
import { NbDateService } from '@nebular/theme';
import { add } from 'date-fns';

@Component({
  selector: 'app-create-education',
  templateUrl: './create-education.component.html',
  styleUrls: ['./create-education.component.scss'],
})
export class CreateEducationComponent implements OnInit {
  educationForm: FormGroup;
  education: Education;
  minBegin: Date;
  minEnd: Date;
  maxEnd: Date;

  validationMessages: {
    name: {
      required: 'Name is required';
      minlenght: 'Name may not be greater then 3 charachters';
    };
    beginDate: {
      required: 'Name is required';
    };
    endDate: {
      required: 'Name is required';
    };
  };

  formError ={
    name:"",
    beginDate:"",
    endDate:"",
  }

  constructor(
    private fb: FormBuilder,
    protected dateService: NbDateService<Date>
  ) {}
  ngOnInit(): void {
    this.educationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      beginDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    this.setPickerRange();
  }

  onSubmit() {
    console.log('Value Begin: ', this.educationForm.get('beginDate').value);
    console.log('Errors Begin: ', this.educationForm.get('beginDate').errors);
    console.log('Value End: ', this.educationForm.get('endDate').value);
    console.log('Errors End: ', this.educationForm.get('endDate').errors);
  }

  // Getters en Setters
  get name() {
    return this.educationForm.get('name');
  }
  get beginDate() {
    return this.educationForm.get('beginDate');
  }
  get endDate() {
    return this.educationForm.get('endDate');
  }

  setPickerRange() {
    this.minBegin = this.dateService.today();
    let last_year = this.dateService.getYear(
      this.dateService.addYear(this.dateService.today(), -1)
    );
    this.minEnd = this.dateService.addMonth(this.dateService.today(), 6);
    this.maxEnd = this.dateService.addYear(new Date(last_year, 12, 31), 3);
  }
}
