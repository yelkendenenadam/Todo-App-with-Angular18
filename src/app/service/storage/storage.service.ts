import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getStorage(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  setStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  deleteStorage(key: string): any {
    localStorage.removeItem(key);
  }
}
