import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set(key: string, value: any): void {
    try {
      const json = JSON.stringify(value);
      localStorage.setItem(key, json);
    } catch (err) {
      console.error('StorageService set error', err);
    }
  }

  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch (err) {
      console.error('StorageService get error', err);
      return null;
    }
  }
}
