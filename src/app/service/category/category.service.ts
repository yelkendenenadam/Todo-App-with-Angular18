import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CategoryItem} from "../../interface/category-item";
import {StorageService} from "../storage/storage.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoriesSubject= new BehaviorSubject<Map<number, CategoryItem>>(new Map<number, CategoryItem>());
  private IDNext = 0;

  constructor(private storage: StorageService) {
    this.loadData();
  }

  private loadData() {
    const data = this.storage.getStorage('categories');
    if (data && data.length > 0) {
      this.categoriesSubject.next(data);
    }

    this.IDNext = this.storage.getStorage('categoryIDLast');

  }

  public getCategories() {
    return this.categoriesSubject.asObservable();
  }

  public addCategory(category: CategoryItem) {
    category.id = this.IDNext++;
    this.categoriesSubject.next(this.categoriesSubject.getValue().set(category.id, category));
    this.storage.setStorage('categories', this.categoriesSubject.getValue());
    this.storage.setStorage('categoryIDLast', this.IDNext);
  }

  public removeCategory(categoryID: number) {
    let categories = this.categoriesSubject.getValue();
    categories.delete(categoryID);
    this.categoriesSubject.next(categories);
    this.storage.setStorage('categories', categories);
  }

}
