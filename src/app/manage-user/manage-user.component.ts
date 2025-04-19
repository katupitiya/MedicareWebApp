import { Component,ElementRef, ViewChild,EventEmitter, Output,Input,OnInit } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  pwd:string;
  isEdit?: boolean;
}

@Component({
  selector: 'app-manage-user',
  standalone: false,
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})
export class ManageUserComponent implements OnInit {
  users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' ,pwd:'......' },
    { id: 2, name: 'Bob', email: 'bob@example.com',pwd:'.......' },
    { id: 2, name: 'Jake', email: 'jake@example.com',pwd:'.......' },
  ];
  @Output() closeManageUser = new EventEmitter<void>();
  isUserCreate=false;

  ngOnInit(): void {

  }
  editedUser: Partial<User> = {};

  editUser(user: User) {
    user.isEdit = true;
    this.editedUser = { ...user }; // shallow copy
  }

  saveUser(user: User) {
    Object.assign(user, this.editedUser);
    user.isEdit = false;
  }

  cancelEdit(user: User) {
    user.isEdit = false;
  }

  deleteUser(userId: number) {
    this.users = this.users.filter(u => u.id !== userId);
  }
  closeModal(): void {
    this.closeManageUser.emit();
    }
    createUser(){
      this.isUserCreate=true;
    }
    hideModal(data:any) {// when success signup/signin and close the model manually
      //  this.isModalVisible = false;
       //  this.message =false;
      //  this.showLoginPage=false;
       // this.showManageUser=false;
       this.isUserCreate=false;
      }

}
