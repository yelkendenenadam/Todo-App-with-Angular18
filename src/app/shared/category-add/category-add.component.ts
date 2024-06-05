import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CategoryService} from "../../service/category/category.service";
import {CategoryItem} from "../../interface/category-item";

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './category-add.component.html',
  styleUrl: './category-add.component.scss'
})
export class CategoryAddComponent {
  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  constructor(private categoryService: CategoryService) { }

  onSubmit() {
    let category: CategoryItem = {
      id: -100,
      name: this.categoryForm.value.name || 'undefined',
    }
    this.categoryService.addCategory(category);
    this.categoryForm.reset()
  }

}
