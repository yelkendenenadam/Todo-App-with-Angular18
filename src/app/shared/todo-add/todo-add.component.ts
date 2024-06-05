import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TodoService} from "../../service/todo/todo.service";
import {CategoryService} from "../../service/category/category.service";
import {Observable} from "rxjs";
import {CategoryItem} from "../../interface/category-item";
import {TodoItem} from "../../interface/todo-item";
import {AsyncPipe, NgFor} from "@angular/common";

@Component({
  selector: 'app-todo-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgFor
  ],
  templateUrl: './todo-add.component.html',
  styleUrl: './todo-add.component.scss'
})
export class TodoAddComponent {
  todoForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    categoryId: new FormControl (null,[Validators.required]),
  });
  categories$!: Observable<CategoryItem[]>;

  constructor(private todoService: TodoService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.categories$ = this.categoryService.getCategories();
  }

  onSubmit() {
    let todo: TodoItem = {
      id: -150,
      title: this.todoForm.value.title || 'undefined',
      categoryId: this.todoForm.value.categoryId || -200
    }
    this.todoService.addTodo(todo);
    this.todoForm.reset();
  }

}
