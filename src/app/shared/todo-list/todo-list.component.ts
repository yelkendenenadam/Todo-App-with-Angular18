import {Component} from '@angular/core';
import {TodoItem} from "../../interface/todo-item";
import {combineLatest, map, Observable, startWith} from "rxjs";
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TodoService} from "../../service/todo/todo.service";
import {CategoryService} from "../../service/category/category.service";
import {AsyncPipe, NgFor} from "@angular/common";
import {CategoryItem} from "../../interface/category-item";

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  todos$!: Observable<TodoItem[]>;
  categories$!: Observable<CategoryItem[]>;
  todoForm = new FormGroup({
    todos: new FormArray([])
  });
  changeDetected = false;

  constructor(private todoService: TodoService, protected categoryService: CategoryService) {}

  ngOnInit() {
    this.todos$ = this.todoService.getFilteredTodos();
    this.categories$ = this.categoryService.getCategories();

    this.todos$.subscribe(todos => {
      const todoArray = this.todoForm.get('todos') as FormArray;
      todoArray.clear();
      todos.forEach(todo => todoArray.push(new FormGroup({
        id: new FormControl(todo.id),
        title: new FormControl(todo.title, Validators.required),
        categoryId: new FormControl(todo.categoryId, Validators.required),
      })));
      this.changeDetected = false;
    });

    combineLatest([
      this.todos$,
      this.todoForm.valueChanges.pipe(
        startWith(this.todoForm.value)
      )
    ]).pipe(
      map(([todos, formValue]) => {
        return this.checkForChange(todos, formValue.todos as TodoItem[])
      })
    ).subscribe(change => this.changeDetected = change);

  }

  onRemove(todoIndex: number) {
    this.todoService.removeTodo((this.todoForm.value.todos as TodoItem[])[todoIndex].id);
  }

  checkForChange(todos: TodoItem[], formArray: TodoItem[]) {
    if (formArray.length !== todos.length) {
      return false;
    }
    for (let i = 0; i < formArray.length; i++) {
      if (formArray[i].title !== todos[i].title || formArray[i].categoryId !== todos[i].categoryId) {
        return true;
      }
    }
    return false;
  }

  onSave() {
    this.todoService.updateTodos(this.todoForm.value.todos as TodoItem[])
    this.changeDetected = false;
  }

}
