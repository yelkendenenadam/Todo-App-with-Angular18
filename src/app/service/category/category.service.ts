import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CategoryItem} from "../../interface/category-item";
import {StorageService} from "../storage/storage.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoriesSubject= new BehaviorSubject<CategoryItem[]>([]);
  private categories$= this.categoriesSubject.asObservable();
  private IDNext = 0;

  constructor(private storage: StorageService) {
    this.loadData();
  }

  private loadData() {
    const data = this.storage.getStorage('categories');
    if (data && data.length > 0) {
      this.categoriesSubject.next(data);
      this.IDNext = data[data.length - 1].id + 1;
    }
  }

  public getCategories() {
    return this.categories$;
  }

  public addCategory(category: CategoryItem) {
    category.id = this.IDNext++;
    this.categoriesSubject.next([...this.categoriesSubject.getValue(), category]);
    this.storage.setStorage('categories', this.categoriesSubject.getValue());
  }

  public removeCategory(categoryID: number) {
    this.categoriesSubject.next( this.categoriesSubject.getValue().filter(category => category.id !== categoryID));
    this.storage.setStorage('categories', this.categoriesSubject.getValue());
  }

  public getCategory(id: number) {
    return this.categoriesSubject.getValue().find(category => category.id == id);
  }
}
