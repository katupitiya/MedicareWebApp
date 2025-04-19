//import { Component } from '@angular/core';
import { Component, ElementRef, ViewChild,EventEmitter, Output, OnInit,Input  } from '@angular/core';
import { UserAuthService } from '../user-auth.service';
//import { Auth, createUserWithEmailAndPassword, UserCredential } from '@angular/fire/auth';

import { FormBuilder, FormGroup, Validators,FormControl,ReactiveFormsModule  } from '@angular/forms';
//import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  showPrescriptionForm = false; //enable Login
  userForm: FormGroup;
  isEdit = false;
  loginTest=0;
  isUserLogged=false;
  userData: any;
  username ='';
  isLoggedIn =false;
  isStaff=false;

  constructor(private fb: FormBuilder, private userAuthService:UserAuthService) {
    this.userForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      // lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required, this.isEqualPassword.bind(this)]),
      
      // address: new FormControl('', [Validators.required])
    });
  }
  @Output() close = new EventEmitter<void>();
  @Output() userName = new EventEmitter<string>();
  @Output() userLoged = new EventEmitter<boolean>();
  @Output() userSignUpSuccess = new EventEmitter<boolean>();
  @Input() login!: Boolean; 
  
  closeModal(): void {
	this.close.emit();
  }

  ngOnInit(): void {
    // this.userForm = this.fb.group({
    //   firstname: new FormControl('', [Validators.required]),
    //   lastname: new FormControl('', [Validators.required]),
    //   email: new FormControl('', [Validators.required, Validators.email]),
    //   address: new FormControl('', [Validators.required])
    // });
   // this.userName.emit('test 1111');
  }
  get firstname() {
    return this.userForm.get('firstname');
  }
  get email() {
    return this.userForm.get('email');
  }
  // isEqualPassword(control: FormControl) {
  //   if (!this.userForm) return null;
  //   return control.value === this.userForm.get('password')?.value ? null : { passwordMismatch: true };
  // }
  isEqualPassword(control: FormControl): {[s: string]: boolean}| null {
    if (!this.userForm) {
        return {passwordsNotMatch: true};

    }
    if (control.value !== this.userForm.controls['password'].value) {
        return {passwordsNotMatch: true};
    }
    return null;
}
  addUser() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
     // console.log(this.userForm.value);
      // API call to add user//
    }
  }
  async  userSignUp(){
    this.loginTest=this.loginTest+1;

    const response = await this.userAuthService.signupUser(this.userForm.value);
    //working fine but do not return username
    // if (response.success ) {
    //   console.log("Signup Successful:", response.data?.user);
    //   this.userSignUpSuccess.emit(true);
    //   if (response.success && response.data?.user) {
    //     this.userName.emit(response.data.user.displayName || '');
    //   }
    // } else {
    //   console.log("Signup Failed:", response.error);
    //   this.userSignUpSuccess.emit(false);
    // }

      //newcode to return user name
      if (response.success && response.data?.user) {
        console.log("Signup Successful:", response.data.user);
    
        // Ensure the user has a displayName
        if (!response.data.user.displayName) {
          console.log('Setting display name...');
          
          await this.userAuthService.setDisplayName(response.data.user, this.userForm.get('firstname')?.value);
          
          // Manually retrieve updated user info
          await response.data.user.reload(); 
        }
    
        console.log("Emitting userName:", response.data.user.displayName || 'No Name');
        this.userName.emit(response.data.user.displayName || 'No Name');
        this.userSignUpSuccess.emit(true);
      } else {
        console.log("Signup Failed:", response.error);
        this.userSignUpSuccess.emit(false);
      }

  }
  async userLogin(){
    try{
      this.userData = await this.userAuthService.signinUser(this.userForm.value);
      if (this.userData && this.userData.user) {
       // this.username = this.userData.displayName;
       //this.userName.emit(this.userData.displayName);
       console.log('User data:', this.userData.user);
       this.userLoged.emit(true);
      // Ensure displayName exists
      let displayName = this.userData.user.displayName;
      if (!displayName) {
        console.log('Username not set. Updating...');
        await this.userAuthService.setDisplayName(this.userData.user, this.userForm.get('firstname')?.value);
        displayName = this.userForm.get('firstname')?.value || 'Guest';
      } console.log('Emitting userName:', displayName);
      this.userName.emit(displayName);
    } else {
      console.error('User data is undefined');
      this.userName.emit('');  // Emit an empty string to indicate failure
    }



      // this.isLoggedIn = true;
      // this.userLoged.emit(true);

      //   if (!this.username) {
      //     console.log('Username not set. Updating...');
      //     await this.userAuthService.setDisplayName(this.userData, this.userForm.get('firstname')?.value);
      //   //  this.username = this.userData.user.displayName;
      //   console.log('1010 are logged in??='+this.userData.user.displayName);
      //     this.userName.emit(this.userData.user.displayName);
      //   }
        
      //   console.log('Welcome,', this.username);
      // }


     // this.userName.emit('test 1010');
      console.log('111 user logged ='+this.userData.user);
      console.log('222 user logged ='+this.userData.user.reloadUserInfo.providerUserInfo);
      console.log('333 user logged ='+this.userData.user.displayName);
     // this.userName.emit(this.userData.user.displayName);
      // const keys = Object.keys(this.userData.user.reloadUserInfo.providerUserInfo);
      // console.log('~~keys='+keys);
       this.isUserLoggedIn();
    }catch(error:any){
     throw error;
    }
    
  }
 async isUserLoggedIn(){
 const isLoggedIn= await this.userAuthService.isLogedIn();
 console.log('~~~~is logged in='+isLoggedIn);
  }
}
