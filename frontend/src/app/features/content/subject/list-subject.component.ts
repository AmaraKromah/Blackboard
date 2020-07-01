import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubject } from 'src/app/core/model/subject.model';
import { Subscription } from 'rxjs';
import { SubjectService } from 'src/app/core/services/subject.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-subject',
  templateUrl: './list-subject.component.html',
  styleUrls: ['./list-subject.component.scss'],
})
export class ListSubjectComponent implements OnInit, OnDestroy {
  subjList: ISubject[] = [];
  private subjSub: Subscription;

  constructor(private subjService: SubjectService, private router: Router) {}

  ngOnInit(): void {
    //Checking for changes (subscription )
    this.subjSub = this.subjService.subjRefreshNeeded$.subscribe(() => {
      this.subjService.getSubjectList().subscribe((data) => {
        this.subjList = data.subjects;
      });
    });

    this.subjService.getSubjectList().subscribe((data) => {
      this.subjList = data.subjects;
    });
  }

  deleteSubj(id: string) {
    this.subjService.deleteSubject(id);
  }

  addAssignments(subj_id: string) {
    this.subjService.subjID = subj_id;
    this.router.navigate(['/dashboard/assignments/create']);
  }

  ngOnDestroy(): void {
    this.subjSub.unsubscribe();
  }
}
