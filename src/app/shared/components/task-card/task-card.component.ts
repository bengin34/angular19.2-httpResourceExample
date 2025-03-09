import { Component, effect, inject, input, output, signal } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {


 task = input<Task | null>();
 viewDetails = output<Task>();
 updateTask = output<Task>();


 /**
  * Emits an event with the task ID when the user clicks on the View Details button
  * @param task 
  */
onViewDetails(task: Task): void {
  this.viewDetails.emit(task)
  console.log(task)
}

onUpdate(task: Task){
  this.updateTask.emit(task)
}



}
