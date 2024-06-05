import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: "full",
    redirectTo: 'category'
  },
  {
    path: 'category',
    loadComponent: () => import('./page/category/category.component') .then(m => m.CategoryComponent),
    title: 'To-Do App - Category'
  },
  {
    path: 'to-do',
    loadComponent: () => import('./page/todo/todo.component') .then(m => m.TodoComponent),
    title: 'To-Do - To-Do List'
  }
];
