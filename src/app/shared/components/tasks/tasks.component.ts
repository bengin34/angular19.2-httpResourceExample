import { Component, inject, signal } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { FieldValueType, SortType, StatusType, Task, TaskAction, TaskActionType } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskService } from '../../services/task.service';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { Comment } from '../../models/task.model';

@Component({
  selector: 'app-tasks',
  imports: [ TaskCardComponent, ReactiveFormsModule, TaskDetailComponent],
  templateUrl: 'tasks.component.html',
  styleUrl: 'tasks.component.css'
})
export class TasksComponent {
  protected readonly taskService = inject(TaskService);

  sortType = signal<SortType>('asc');
  pageNumber = signal<number>(1);
  sortField = signal<string>('title');
  selectedTask = signal<Task | null>(null);
  isOpen = false;
  currentMode = 'view' as TaskActionType;
  statusFilter = new FormControl<StatusType | null>(null);
  filters = signal<FieldValueType[]>([]);

  tasksListResource = this.taskService.getTaskListResource(
    () => this.pageNumber(),
    () => this.sortType(),
    () => this.sortField(),
    () => this.filters()
  );

  commentsResource = this.taskService.getTaskCommentsResource(
    () => this.selectedTask()?.id
  );

  constructor() {
    this.statusFilter.valueChanges.subscribe((value) => {
      this.filters.update((filters) => {
        // Check if 'status' already exists in the filters array
        const existingStatusIndex = (filters || []).findIndex(
          (filter) => filter.field === 'status'
        );

        if (existingStatusIndex !== -1) {
          // If 'status' exists, update its value
          const updatedFilters = [...filters];
          updatedFilters[existingStatusIndex] = { field: 'status', value };
          return updatedFilters;
        } else {
          // If 'status' does not exist, append it to the array
          return [
            ...(filters || []),
            {
              field: 'status',
              value,
            },
          ];
        }
      });

      console.log('filters: ', this.filters());
    });
  }

  onUpdatePageNumber() {
    this.pageNumber.update((n) => n + 1);
  }

  onViewTaskDetails(task: Task): void {
    this.openModal('view', task);
  }

  onUpdateTask(task: Task): void {
    this.openModal('update', task);
  }

  onCreateTask(): void {
    this.openModal('create');
  }

  selectedTaskChanged(task: Task): void {
    this.openModal('view', task);
  }

  /**
   * On create or update actions
   */
  async onTaskAction(taskAction: TaskAction) {
    try {
      if (taskAction.action === 'create') {
        await firstValueFrom(this.taskService.createTask(taskAction.task));
      } else {
        await firstValueFrom(this.taskService.updateTask(taskAction.task));
      }
      // reload task list results
      this.tasksListResource.reload();
    } catch (error) {
      console.error(`Error while ${taskAction.action}ing the task: ${error}`);
    }
  }

  private openModal(mode: TaskActionType, task?: Task): void {
    this.selectedTask.set(task ?? null); // Set selectedTask (null if creating a new task)
    this.currentMode = mode; // Set currentMode: view, update or create
    this.isOpen = true; // Open the modal
  }
}
