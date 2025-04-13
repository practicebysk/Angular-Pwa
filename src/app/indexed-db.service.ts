// src/app/services/indexed-db.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private db: IDBDatabase | null = null;

  constructor() {
    // this.openDB();
  }

  openDB() {
    const request = indexedDB.open('MyPwaDB', 1);

    request.onerror = (event) => {
      console.error('Database error:', (event.target as any).errorCode);
    };

    request.onsuccess = () => {
      this.db = request.result;
      console.log('Database opened');
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
      }
    };
  }

  addUser(user: { name: string; email: string }): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');
      const tx = this.db.transaction(['users'], 'readwrite');
      const store = tx.objectStore('users');
      const request = store.add(user);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  getAllUsers(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');
      const tx = this.db.transaction(['users'], 'readonly');
      const store = tx.objectStore('users');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  deleteUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');
      const tx = this.db.transaction(['users'], 'readwrite');
      const store = tx.objectStore('users');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
