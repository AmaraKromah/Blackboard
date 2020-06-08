import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IEducation } from 'src/app/core/model/education.model';
import { NbDateService } from '@nebular/theme';
import { parseISO } from 'date-fns';
import { EducationService } from 'src/app/core/services/education.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-create-education',
  templateUrl: './create-education.component.html',
  styleUrls: ['./create-education.component.scss'],
})
export class CreateEducationComponent implements OnInit {
  educationForm: FormGroup;
  education: IEducation;
  minBegin: Date;
  minEnd: Date;
  maxEnd: Date;
  mode: string = 'create';
  edu_id: string = '';

  constructor(
    private fb: FormBuilder,
    protected dateService: NbDateService<Date>,
    private educationService: EducationService,
    public route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.educationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      beginDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    this.setPickerRange();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.edu_id = paramMap.get('id');
        this.educationService.getEducation(this.edu_id).subscribe((data) => {
          this.education = data['response'].education[0];
          this.educationForm.setValue({
            name: this.education.name,
            beginDate: new Date(this.education.begin_date),
            endDate: new Date(this.education.end_date),
          });
        });
      } else {
        this.mode = 'create';
      }
    });
  }

  onSubmit() {
    let toSubmit = {
      _id: null,
      name: this.educationForm.value.name,
      begin_date: this.educationForm.value.beginDate,
      end_date: this.educationForm.value.endDate,
    };
    if (this.educationForm.valid) {
      if (this.mode === 'create') {
        this.educationService.addEducation(toSubmit);
      } else {
        toSubmit._id = this.education._id;
        this.educationService.updateEducation(toSubmit);
      }
    }else{
      console.log("Invalid form");
    }
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
