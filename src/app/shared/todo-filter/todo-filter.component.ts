import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {combineLatest, debounceTime, map, Observable, startWith, Subscription} from "rxjs";
import {CategoryItem} from "../../interface/category-item";
import {TodoItem} from "../../interface/todo-item";
import {CategoryService} from "../../service/category/category.service";
import {TodoService} from "../../service/todo/todo.service";
import {AsyncPipe, NgFor} from "@angular/common";

@Component({
  selector: 'app-todo-filter',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgFor
  ],
  templateUrl: './todo-filter.component.html',
  styleUrl: './todo-filter.component.scss'
})
export class TodoFilterComponent {
  filterForm = new FormGroup({
    title: new FormControl( ''),
    category: new FormControl( '')
  })
  categories$!: Observable<Map<number, CategoryItem>>
  filterSubscription!: Subscription;

  constructor(private categoryService: CategoryService, private todoService: TodoService) {  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();

    this.filterSubscription = combineLatest([
      this.todoService.getTodos(),
      this.filterForm.get('title')!.valueChanges.pipe(
        startWith(''),
        debounceTime(500)
      ),
      this.filterForm.get('category')!.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([todos, title, category]) => {
        return this.todoService.filterTodos(title || '', category || '')
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }
}
