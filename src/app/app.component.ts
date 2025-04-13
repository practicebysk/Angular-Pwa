// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  users: any[] = [];

  constructor(private indexedDb: IndexedDbService) { }

  async ngOnInit() {
    await this.indexedDb.openDB();
    this.loadUsers();
  }

  addUser() {
    const user = { name: 'Kinar', email: 'kinar@example.com' };
    this.indexedDb.addUser(user).then(() => this.loadUsers());
  }

  deleteUser(id: number) {
    this.indexedDb.deleteUser(id).then(() => this.loadUsers());
  }

  loadUsers() {
    this.indexedDb.getAllUsers().then(users => {
      this.users = users;
    });
  }
}
