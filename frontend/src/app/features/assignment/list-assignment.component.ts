import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { AssignmentService } from 'src/app/core/services/assignment.service';
import { Router } from '@angular/router';
import { IAssignment } from 'src/app/core/model/assignment.model';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-list-assignment',
  templateUrl: './list-assignment.component.html',
  styleUrls: ['./list-assignment.component.scss'],
})
export class ListAssignmentComponent implements OnInit, OnDestroy {
  taskList: IAssignment[] = [];
  allSelectedList: string[] = [];
  isActive = false;
  private selectedCheckBox: string[][] = [];
  private form: FormGroup;
  private taskSub: Subscription;

  constructor(
    private taskService: AssignmentService,
    private router: Router,
    private fb: FormBuilder,
    private dialogService: NbDialogService
  ) {
    this.form = this.fb.group({
      checkArray: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    console.log('Getting tasks');
    this.taskSub = this.taskService.taskRefreshNeeded$.subscribe((data) => {
      this.getTaskList();
      if ((data = 'deleteFile')) this.isActive = true;
    });
    this.getTaskList();
  }

  onCheckboxChange(checked: boolean, task_id: string, file_id: string) {
    if (checked) {
      this.selectedCheckBox.push([task_id, file_id]);
    } else {
      this.selectedCheckBox.forEach((item, i) => {
        if (item[0] == task_id && item[1] == file_id) {
          this.selectedCheckBox.splice(i, 1);
        }
      });
    }
  }
  selectAll(task_id: string): void {
    if (this.allSelectedList.includes(task_id)) {
      //drop the files and the task
      this.allSelectedList.forEach((item: string, index) => {
        if (item === task_id) {
          this.allSelectedList.splice(index, 1);
        }
      });
      this.selectedCheckBox = this.selectedCheckBox.filter(
        (task) => task[0] != task_id
      );
    } else {
      // add only unique values
      this.allSelectedList.push(task_id);
      let task = this.taskList.filter((val) => val._id === task_id)[0].file;
      Object.values(task).forEach((file) => {
        let file_id = file['_id'];
        //#making sure that the file is not yet present
        let present = this.selectedCheckBox.some((row) =>
          row.includes(file_id)
        );
        if (!present) {
          this.selectedCheckBox.push([task_id, file_id]);
        }
      });
    }
  }

  deleteTask(task_id: string): void {
    let filesToDelete = this.taskList.filter((val) => val._id === task_id)[0]
      .file;
    let filesToDeleteID: string[] = Object.values(filesToDelete).map(
      (file) => file['_id']
    );
    this.taskService.deleteAssignment(task_id, filesToDeleteID, true);
  }
  deleteTaskFiles(task_id: string):void {
    let filesToDeleteID: string[] = [];

    filesToDeleteID = this.selectedCheckBox
      .filter((files) => files[0] == task_id)
      .map((files) => files[1]);
    this.taskService.deleteAssignment(task_id, filesToDeleteID, false);
  }

  ngOnDestroy(): void {
    this.taskSub.unsubscribe();
  }

  openDialogBox(dialog: TemplateRef<any>, task_id: string, file: []): void {
    this.dialogService.open(dialog, {
      context: { file_length: file.length, task_id },
    });
  }
  private getTaskList() {
    this.taskService.getAssignmentList().subscribe((task_list) => {
      this.taskList = task_list.assigments;
    });
  }
}
