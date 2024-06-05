import { Component } from '@angular/core';
import {CategoryAddComponent} from "../../shared/category-add/category-add.component";
import {CategoryListComponent} from "../../shared/category-list/category-list.component";
import {NavbarComponent} from "../../shared/navbar/navbar.component";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CategoryAddComponent,
    CategoryListComponent,
    NavbarComponent,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

}
