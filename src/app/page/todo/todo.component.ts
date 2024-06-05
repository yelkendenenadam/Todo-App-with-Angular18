import { Component } from '@angular/core';
import {TodoAddComponent} from "../../shared/todo-add/todo-add.component";
import {TodoFilterComponent} from "../../shared/todo-filter/todo-filter.component";
import {TodoListComponent} from "../../shared/todo-list/todo-list.component";
import {NavbarComponent} from "../../shared/navbar/navbar.component";

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    TodoAddComponent,
    TodoFilterComponent,
    TodoListComponent,
    NavbarComponent
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent {

}
