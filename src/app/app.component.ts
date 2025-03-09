import { Component, effect, inject } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskService } from './shared/services/task.service';
import { TasksComponent } from './shared/components/tasks/tasks.component';

@Component({
  selector: 'app-root',
  imports: [ DashboardComponent, TasksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'http-resource';

  dashboardResource = inject(TaskService).getTaskBoardStatsResource();

}
