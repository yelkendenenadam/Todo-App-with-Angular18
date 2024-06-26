import { Injectable } from '@angular/core';
import {StorageService} from "../storage/storage.service";
import {BehaviorSubject} from "rxjs";
import {TodoItem} from "../../interface/todo-item";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Map<number, TodoItem>>(new Map<number, TodoItem>())
  private filteredTodosSubject = new BehaviorSubject<Map<number, TodoItem>>(new Map<number, TodoItem>())
  private IDNext = 0;

  constructor(private storage: StorageService) {
    this.loadData();
  }

  private loadData(): void {
    const data = this.storage.getStorage('todos');
    if (data && data.length > 0) {
      this.todosSubject.next(data);
      this.filteredTodosSubject.next(data);
      this.IDNext = data[data.length - 1].id + 1;
    }
  }

  public getTodos(){
    return this.todosSubject.asObservable();
  }

  public getFilteredTodos(){
    return this.filteredTodosSubject.asObservable();
  }

  public addTodo(todo: TodoItem) {
    todo.id = this.IDNext++;
    this.todosSubject.next(this.todosSubject.getValue().set(todo.id, todo));
    this.storage.setStorage('todos', this.todosSubject.getValue());
  }

  public removeTodo(todoId: number) {
    let todos = this.todosSubject.getValue();
    todos.delete(todoId);
    this.todosSubject.next(todos);
    this.storage.setStorage('todos', todos);
  }

  public filterTodos(title: string, category: string){
    if (title.trim() === '' && category === '') {
      this.filteredTodosSubject.next(this.todosSubject.getValue());
      return;
    }

    title = title.trim().toLowerCase();

    let filteredTodos = new Map<number, TodoItem>();
    this.todosSubject.getValue().forEach(todo => {
      if (title === '' && category !== '' && todo.categoryId == +category){
        filteredTodos.set(todo.id, todo);
      }
      else if (title !== '' && category === '' && todo.title.toLowerCase().includes(title)) {
        filteredTodos.set(todo.id, todo);
      }
      else if (title !== '' && category !== '' && todo.categoryId == +category && todo.title.toLowerCase().includes(title)) {
        filteredTodos.set(todo.id, todo);
      }
    });
    this.filteredTodosSubject.next(filteredTodos);
  }

  public updateTodos(todosToUpdate: TodoItem[]) {
    let todos = this.todosSubject.getValue();
    todosToUpdate.forEach(todoToUpdate => {
      todos.set(todoToUpdate.id, todoToUpdate);
    });
    this.todosSubject.next(todos);
    this.storage.setStorage('todos', todos);
  }
}
