import {
  httpResource,
  HttpResourceRef,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import {
  Comment,
  DashboardStats,
  FieldValueType,
  SortType,
  StatusType,
  Task,
  TaskDetails,
} from '../models/task.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:3000';
  private readonly http = inject(HttpClient);

  getTaskBoardStatsResource(): HttpResourceRef<DashboardStats | undefined> {
    return httpResource<DashboardStats>(() => `${this.baseUrl}/dashboard`);
  }

  getTaskListResource(
    pageNumber: () => number,
    sortOrder: () => SortType,
    sortField: () => string,
    filters: () => FieldValueType[],
    limit?: () => string
  ): HttpResourceRef<Task[]> {
    return httpResource<Task[]>(
      () => {
        const queryParams = computed(() => {
          const baseParams: Record<string, string | number> = {
            _page: pageNumber(),
            _sort: sortOrder() === 'desc' ? `-${sortField()}` : sortField(),
            _limit: limit?.() ?? 9,
          };

          // Add filters is present
          if (filters() && filters().length > 0) {
            const filterParams: { [key: string]: string | number } = {};
            filters().forEach((filter) => {
              if (!!filter.value) {
                filterParams[filter.field] = this.getStatusLabel(
                  filter.value as StatusType
                );
              }
            });

            return { ...baseParams, ...filterParams };
          }

          return baseParams;
        });

        return {
          url: `${this.baseUrl}/tasks`,
          method: 'GET',
          params: queryParams(),
        };
      },
      {
        defaultValue: [],
      }
    );
  }

  getTaskDetailResource(selectedTaskId: () => number | undefined) : HttpResourceRef< TaskDetails | null >  {
    return httpResource<TaskDetails | null>(
      () => !selectedTaskId() ? undefined : {
        url : `${this.baseUrl}/tasks/${selectedTaskId()}`,
        method: 'GET',
        headers: new HttpHeaders({ Accept: 'application/json' }),
      },
      {
        defaultValue: null, // default value when the resourse has not loaded yet
      }
    )
  } 

  createTaskResource(newTask: () => Task): HttpResourceRef<Task | undefined> {
    return httpResource<Task | undefined>(
      () => ({
        url: `${this.baseUrl}/tasks`,
        method: 'POST',
        body: newTask(),
        headers: new HttpHeaders({'Content-Type':'application/json'})
      }),
      {
        defaultValue: undefined
      }
    )
  }


  createTask(task: Task) : Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`,task).pipe(
      catchError((error) => {
        console.error('Error updating task:', error);
        return throwError(() => new Error(`Failed to update task`)) 
      })
    )
  }

 
  updateTask(task:Task): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/tasks/${task.id}`,task).pipe(
      catchError((error) => {
        console.error('Error updating tasks:',error);
        return throwError(() => new Error('Failed to update task'))
      })
    )
  }

  getTaskCommentsResource(
    selectedTaskId: () => number | undefined
  ): HttpResourceRef<Comment[] | undefined> {
    return httpResource<Comment[] | undefined>(() =>
      !selectedTaskId()
        ? undefined
        : {
            url: `${this.baseUrl}/comments?taskId=${selectedTaskId()}`,
          }
    );
  }


  private getStatusLabel(status: StatusType): string {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return 'Completed';
    }
  }
}