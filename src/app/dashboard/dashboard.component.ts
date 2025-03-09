import { Component, input } from '@angular/core';
import { TaskCardComponent } from '../shared/components/task-card/task-card.component';
import { DashboardStats, statsConfig } from '../shared/models/task.model';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
 dashboardStats = input<DashboardStats | undefined > (undefined)
 statsConfig = statsConfig
}
