import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { ListEducationComponent } from './education/list-education.component';
import { CreateEducationComponent } from './education/create-education.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbDatepickerModule,
} from '@nebular/theme';

@NgModule({
  declarations: [ListEducationComponent, CreateEducationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbDatepickerModule,
    ContentRoutingModule,
  ],
})
export class ContentModule {}
