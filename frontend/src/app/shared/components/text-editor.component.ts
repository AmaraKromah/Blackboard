import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit {
  form: FormGroup;
  private _initialParentDescription = new BehaviorSubject<string>('');
  _description: string;

  //we aboneren ons op de ouders output
  @Input() set initialParentDescription(value: string) {
    this._initialParentDescription.next(value);
  }
  @Output() editorEvent = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      description: '',
    });

    this._initialParentDescription.subscribe((initValue) => {
      this._description = initValue;
    });

    this.form.valueChanges.subscribe(() => {
      this.editorEvent.emit(this.description.value);
    });
  }

  get description() {
    return this.form.get('description');
  }
  get initialParentDescription() {
    return this._initialParentDescription.getValue();
  }

  ngOnDestroy() {
    this._initialParentDescription.unsubscribe();
  }
}
