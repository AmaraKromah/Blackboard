import { Component, OnInit, SecurityContext } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TaskType } from '../../../shared/helpers/task_types';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AssignmentService } from 'src/app/core/services/assignment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IAssignment } from 'src/app/core/model/assignment.model';
import { Subscription } from 'rxjs';
import { SubjectService } from 'src/app/core/services/subject.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UtilityService } from 'src/app/shared/utilities/utility.service';
@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.scss'],
})
export class CreateAssignmentComponent implements OnInit {
  taskType = Object.keys(TaskType);
  assignment: IAssignment;
  displayMode: string = 'create';
  taskForm: FormGroup;
  checkBoxFilesSelect: string[] = [];
  fileLength: number;
  private replaceFile: boolean = true;
  private task_id: string = '';
  private file: string[] = [];
  private taskSub: Subscription;
  private subjID: string;

  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private taskService: AssignmentService,
    private subjService: SubjectService,
    private sanitized: DomSanitizer,
    private utility: UtilityService
  ) {}

  editorEvent(event: any) {
    // console.log('Editor event: ', event);
    const childEditor = this.sanitized.sanitize(
      SecurityContext.HTML,
      this.sanitized.bypassSecurityTrustHtml(event)
    );
    this.taskForm.patchValue({
      description: childEditor,
    });
  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: '',
      description: '',
      files: ['', [checkFileType]],
      type: '',
      deadline: '',
    });
    //valideren

    if (this.subjService.subjID) {
      localStorage.setItem('subjID', this.subjService.subjID);
      this.subjID = localStorage.getItem('subjID');
    } else {
      this.subjID = localStorage.getItem('subjID');
    }
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.displayMode = 'edit';
        this.task_id = paramMap.get('id');
        this.taskSub = this.taskService.taskRefreshNeeded$.subscribe((data) => {
          this.getTaskEdit();
        });
        this.getTaskEdit();
      } else {
        this.displayMode = 'create';
      }
    });
  }
  onFilePicked(fileList: FileList) {
    const files = fileList;
    this.taskForm.patchValue({ files });
  }

  selectSingle(checked: boolean, file_id: string) {
    let index = this.checkBoxFilesSelect.findIndex((el) => el == file_id);
    if (checked) {
      if (index == -1) this.checkBoxFilesSelect.push(file_id);
    } else {
      this.checkBoxFilesSelect.splice(index, 1);
      if (this.checkBoxFilesSelect.length == 1) this.checkBoxFilesSelect.pop();
    }
  }
  selectAll() {
    let task_id = this.assignment._id;

    if (this.checkBoxFilesSelect.includes(task_id)) {
      this.checkBoxFilesSelect = [];
    } else {
      this.checkBoxFilesSelect = [];
      this.checkBoxFilesSelect.push(task_id);
      this.checkBoxFilesSelect.push(...this.file);
    }
  }
  replaceCurrent(checked: boolean) {
    this.replaceFile = checked;
  }
  deleteSelected() {
    let toDelete = this.checkBoxFilesSelect.filter(
      (el) => el != this.assignment._id
    );
    // console.log('delete selected files without task', toDelete);

    this.taskService.deleteAssignment(this.assignment._id, toDelete, false);
  }
  onSubmit() {
    let toSubmit = {
      _id: null,
      title: this.title.value,
      description: this.description.value,
      type: this.taskForm.value.type,
      deadline: new Date(this.deadline.value),
      send_at: new Date(),
      files: this.files.value,
    };

    if (this.taskForm.valid) {
      if (this.displayMode === 'create') {
        this.subjID = typeof this.subjID === 'undefined' ? '' : this.subjID;
        console.log('Sending data', toSubmit);
        this.taskService.addAssignment(
          toSubmit.title,
          toSubmit.description,
          toSubmit.type,
          toSubmit.deadline,
          toSubmit.send_at,
          this.subjID,
          toSubmit.files
        );
      } else {
        toSubmit._id = this.assignment._id;
        this.taskService.updateAssignment(
          toSubmit._id,
          toSubmit.title,
          toSubmit.description,
          toSubmit.type,
          toSubmit.deadline,
          toSubmit.send_at,
          toSubmit.files,
          this.replaceFile
        );
      }
    } else {
      console.log('Invalid form: flash massage must be shown');
      return;
    }
  }
  get title() {
    return this.taskForm.get('title');
  }
  get description() {
    return this.taskForm.get('description');
  }
  get type() {
    return this.taskForm.get('type');
  }
  get files() {
    return this.taskForm.get('files');
  }
  get deadline() {
    return this.taskForm.get('deadline');
  }
  private getTaskEdit() {
    this.taskService.getAssignment(this.task_id).subscribe((data) => {
      this.assignment = data.assignment;
      this.file = Object.values(this.assignment.file).map(
        (file) => file['_id']
      );
      this.fileLength = this.file.length;
      this.taskForm.patchValue({
        title: this.assignment.title,
        description: this.utility.convertSanitizedToHtml(
          this.assignment.description
        ),
        type: this.assignment.type,
        deadline: new Date(this.assignment.deadline),
      });
    });
  }

  ngOnDestroy(): void {
    if (this.displayMode === 'edit') this.taskSub.unsubscribe();
    localStorage.removeItem('subjID');
  }
}
//cutom validation
function checkFileType(
  control: AbstractControl
): { [key: string]: any } | null {
  const files: File[] = control.value;
  let errors: string[] = [];

  if (files.length >= 1 && files) {
    for (let index = 0; index < files.length; index++) {
      //Use a type list here if need be
      if (files[index].type === '') {
        errors.push(`${files[index].name} has an invalid type of unknown\n`);
      }
    }
    return errors.length >= 1 ? { invalid_type: errors } : null;
  }
  return null;
}
