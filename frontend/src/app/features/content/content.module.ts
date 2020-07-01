import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbDatepickerModule,
  NbSelectModule,
  NbTabsetModule,
  NbIconModule,
  NbCheckboxModule,
} from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ContentRoutingModule } from './content-routing.module';
import { ListEducationComponent } from './education/list-education.component';
import { CreateEducationComponent } from './education/create-education.component';
import { ListSubjectComponent } from './subject/list-subject.component';
import { CreateSubjectComponent } from './subject/create-subject.component';
import { CreateAssignmentComponent } from './assignment/create-assignment.component';
import { ListAssignmentComponent } from './assignment/list-assignment.component';
import { NoSanitizePipe } from 'src/app/shared/helpers/pipes/no-sanitize.pipe';
import { TextEditorComponent } from 'src/app/shared/components/text-editor.component';

@NgModule({
  declarations: [
    ListEducationComponent,
    CreateEducationComponent,
    ListSubjectComponent,
    CreateSubjectComponent,
    ListAssignmentComponent,
    CreateAssignmentComponent,
    NoSanitizePipe,
    TextEditorComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    EditorModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbDatepickerModule,
    NbSelectModule,
    NbTabsetModule,
    NbIconModule,
    NbCheckboxModule,
    ContentRoutingModule,
  ],
})
export class ContentModule {}
