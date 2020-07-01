import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { EducationService } from 'src/app/core/services/education.service';
import { ISubject } from 'src/app/core/model/subject.model';
import { Subscription } from 'rxjs';
import { IEducation } from 'src/app/core/model/education.model';
import { SubjectService } from 'src/app/core/services/subject.service';

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.scss'],
})
export class CreateSubjectComponent implements OnInit, OnDestroy {
  subjectForm: FormGroup;
  eduList: IEducation[] = [];

  private subject: ISubject;
  private mode: string = 'create';
  private subj_id: string = '';
  private eduSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    public route: ActivatedRoute,
    private eduService: EducationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      education: ['', Validators.required],
    });

    // subscribe to the edu list to keep
    this.eduSub = this.eduService.eduRefreshNeeded$.subscribe(() => {
      this.getEduList();
    });
    // get the list
    this.getEduList();

    //
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.subj_id = paramMap.get('id');
        this.subjectService.getSubject(this.subj_id).subscribe((data) => {
          this.subject = data.subject;

          this.subjectForm.patchValue({
            name: this.subject.name,
            education: this.subject.education[0],
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
      name: this.subjectForm.value.name,
      education: this.subjectForm.value.education,
    };
    if (this.subjectForm.valid) {
      if (this.mode === 'create') {
        this.subjectService.addSubject(toSubmit);
      } else {
        toSubmit._id = this.subject._id;
        this.subjectService.updateSubject(toSubmit);
      }
    }
  }
  ngOnDestroy(): void {
    this.eduSub.unsubscribe();
  }

  //getters and setters
  get name() {
    return this.subjectForm.get('name');
  }
  get education() {
    return this.subjectForm.get('education');
  }

  //getting the edu list for our select option
  private getEduList() {
    this.eduService.getEducationList().subscribe(
      (list) => {
        if (list.educations) {
          this.eduList = list.educations.sort((a, b) =>
            a.name > b.name ? 1 : -1
          );
        } else {
          this.eduList = [];
        }
      },
      (error) => {
        if (error.status == 500) this.router.navigate(['error_500']);
        if (error.status == 500) this.router.navigate(['error_500']);
      }
    );
  }
}
