import { Component } from '@angular/core';
import {CategoryService} from "../../service/category/category.service";
import {CategoryItem} from "../../interface/category-item";
import {AsyncPipe, NgFor} from "@angular/common";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    NgFor,
    AsyncPipe
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  categories$! : Observable<Map<number, CategoryItem>>;

  constructor(protected categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
  }


  onRemove(id: number): void {
    this.categoryService.removeCategory(id);
  }
}
