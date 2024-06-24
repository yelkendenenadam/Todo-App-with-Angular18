import {Component} from '@angular/core';
import {TodoItem} from "../../interface/todo-item";
import {combineLatest, map, Observable, startWith, Subscription} from "rxjs";
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
  todos$!: Map<number, TodoItem>;
  categories$!: Observable<Map<number, CategoryItem>>
  todosSubscription!: Subscription;
  filteredTodos$!: Map<number, TodoItem>;
  filteredTodosSubscription!: Subscription;
  todoForm = new FormGroup({
    todos: new FormArray([])
  });

  constructor(private todoService: TodoService, protected categoryService: CategoryService) {}

  ngOnInit() {
    this.categories$ = this.categoryService.getCategories();
    this.todosSubscription = this.todoService.getTodos().subscribe(todos => {
      this.todos$ = todos;
      const todoArray = this.todoForm.get('todos') as FormArray;
      todoArray.clear();
      todos.forEach(todo => todoArray.push(new FormGroup({
        id: new FormControl(todo.id),
        title: new FormControl(todo.title, Validators.required),
        categoryId: new FormControl(todo.categoryId, Validators.required),
      })));
    });
    this.filteredTodosSubscription = this.todoService.getFilteredTodos().subscribe(filteredTodos => {
      this.filteredTodos$ = filteredTodos;
    });
  }

  ngOnDestroy() {
    this.todosSubscription.unsubscribe();
    this.filteredTodosSubscription.unsubscribe();
  }

  onRemove(todoIndex: number) {
    this.todoService.removeTodo((this.todoForm.value.todos as TodoItem[])[todoIndex].id);
  }


  isVisible(index: number) {
    return this.filteredTodos$.has((this.todoForm.value.todos as TodoItem[])[index].id);
  }

  onSave() {
    const formArray = this.todoForm.get('todos') as FormArray;
    const todosToUpdate = formArray.controls
      .filter(control => control.dirty)
      .map(control => control.value);
    this.todoService.updateTodos(todosToUpdate);
    this.todoForm.markAsPristine();
  }
}
