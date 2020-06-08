import { Component, OnInit, OnDestroy } from '@angular/core';
import { IEducation } from 'src/app/core/model/education.model';
import { EducationService } from 'src/app/core/services/education.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-education',
  templateUrl: './list-education.component.html',
  styleUrls: ['./list-education.component.scss'],
})
export class ListEducationComponent implements OnInit, OnDestroy {
  eduList: IEducation[] = [];
  private eduSub: Subscription;

  constructor(private eduService: EducationService, private router: Router) {}

  ngOnInit(): void {
    //Deze refresh event vind enkel plaats als er wijzigingen zijn gebeurd door de observable
    this.eduSub = this.eduService.eduRefreshNeeded$.subscribe(() => {
      this.getEduList();
    });
    //De is de standaard event
    this.getEduList();
  }

  deleteEdu(id: string) {
    this.eduService.deleteEducation(id);
  }

  ngOnDestroy() {
    this.eduSub.unsubscribe();
  }
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
