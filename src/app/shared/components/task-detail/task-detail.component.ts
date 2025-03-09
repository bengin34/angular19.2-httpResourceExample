import { DatePipe } from '@angular/common';
import { Component, effect, input, model, output, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment, Task, TaskAction, TaskActionType } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  imports: [DatePipe, FormsModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent {

  readonly modalTitleId = `modal-title-${Math.random().toString(36).substring(2,9)}`

// Inputs
  task = input<Task | null>()
  comments = input<Comment[] | null>(null)
  currentMode = input.required<TaskActionType>()
  showPopup = model(false)

  // Output
  taskAction = output<TaskAction>()

  //State
  editedTask = signal<Partial<Task>>({})
  protected readonly modelTitleMap : Record< TaskActionType, string> = {
    view :'Task Details',
    create: 'Create Task',
    update: 'Update Task',
  }

  protected readonly statusClassMap: Record<string, string> = {
    Completed: 'status-completed',
    InProgress: 'status-in-progress',
    Pending: 'status-pending',
  };

  ngOnChanges(changes: SimpleChanges):void {
    if(      ('currentMode' in changes || 'task' in changes) && this.currentMode() !== 'view'    ){
      this.editedTask.set({
        ...(this.task() ?? {}),
        title: this.task()?.title ?? '',
        status: this.task()?.status ?? 'Pending',
      })
    }
  }

  onSubmit():void {
    const actionData = {
      task: this.editedTask(),
      orginalTask: this.task(),
      action: this.currentMode(),
    } as TaskAction;

    this.taskAction.emit(actionData);
    this.showPopup.set(false)
  }


}
