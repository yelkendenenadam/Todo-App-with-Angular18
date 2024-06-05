import { Injectable } from '@angular/core';
import {StorageService} from "../storage/storage.service";
import {BehaviorSubject} from "rxjs";
import {TodoItem} from "../../interface/todo-item";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject = new BehaviorSubject<TodoItem[]>([])
  private todos$ = this.todosSubject.asObservable();
  private filteredTodosSubject = new BehaviorSubject<TodoItem[]>([]);
  private filteredTodos$ = this.filteredTodosSubject.asObservable();
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
    return this.todos$;
  }

  public getFilteredTodos(){
    return this.filteredTodos$;
  }

  public addTodo(todo: TodoItem) {
    todo.id = this.IDNext++;
    this.todosSubject.next([...this.todosSubject.getValue(), todo]);
    this.storage.setStorage('todos', this.todosSubject.getValue());
  }

  public removeTodo(todoId: number) {
    this.todosSubject.next( this.todosSubject.getValue().filter(todo => todo.id !== todoId));
    this.storage.setStorage('todos', this.todosSubject.getValue());
  }

  public filterTodos(title: string, category: string){
    const filteredTodos = this.todosSubject.getValue().filter(todo => {
      if (title.trim() === '' && category.trim() === '') {
        return true;
      }

      const titleMatch = todo.title.toLowerCase().includes(title.toLowerCase());
      const categoryMatch = todo.categoryId == +category;

      if (title.trim() !== '' && category.trim() === '') {
        return titleMatch;
      }
      if (title.trim() === '' && category.trim() !== '') {
        return categoryMatch;
      }
      return titleMatch && categoryMatch;
    });
    this.filteredTodosSubject.next(filteredTodos);
  }

  public updateTodos(todosToUpdate: TodoItem[]) {
    const todos = this.todosSubject.getValue();
    todosToUpdate.forEach(todoToUpdate => {
      const todoIndex = todos.findIndex(todo => todoToUpdate.id === todo.id);
      todos[todoIndex] = todoToUpdate;
    })
    this.todosSubject.next(todos);
    this.storage.setStorage('todos', this.todosSubject.getValue());
  }

}
