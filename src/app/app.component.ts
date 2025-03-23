import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from './user-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MedicareWebApp';
  showLoginPage=false;
  currentTimeOfDay: string = '';
  constructor(private router: Router,private userAuthService:UserAuthService) {
    this.showLoginPage=false;
    this.setTimeOfDay();
  }
  showComponent = false; // Controls the visibility of MyNewComponent
  
  isModalVisible=false;
  message = false;
  LoggedUserName='';
  isLogIn=false;
  isSignUpOkay:boolean=false;
  isLogout:boolean=true;

  toggleComponent() {
    this.showComponent = !this.showComponent; // Toggle visibility on button click
    //this.router.navigate(['/store']);
  }
  showLogin() {
    //this.showLoginPage = !this.showLoginPage; // Toggle visibility on button click
  //  this.isModalVisible = true;
    this.message =true;
    this.showLoginPage=true;
    //this.showIsLogIn();
    //this.router.navigate(['/login']);
  }

  hideModal(data:any) {// when success signup/signin and close the model manually
  //  this.isModalVisible = false;
     this.message =false;
    this.showLoginPage=false;
    if(typeof data=='boolean'){
        //this.isLogIn=true;
        
    }
    else{

    }
    }

    receiveData(data: string){
      this.LoggedUserName= data;
      this.isLogout=false;
      if (!data) {
        console.error("Received empty data from child component!");
      }
      console.log("logged user name1="+data);
      console.log("logged user name="+this.LoggedUserName);
    }
    async   showLogout(){
      const success = await this.userAuthService.logout();
      if (success) {
        console.log("Logout successful");
        this.LoggedUserName= '';
        this.hideModal(true);
        this.isLogout =true;
      } else {
        console.log("Logout failed");
      }
    }
    showIsLogIn(){
    const logedIn=  this.userAuthService.isLogedIn();
    console.log('~~~888='+logedIn);
  
    }
    hideWhenSuccessSignUp(data: any){
      //
      if(typeof data=='string'){
        this.LoggedUserName= data;
        
      }
      else{
        if(data){
          this.isSignUpOkay=data;
          this.hideModal(true);
        }
        else{
          console.log('~~~1010 sign up not success');
        }
       
      }
    }
    setTimeOfDay() {
      const currentHour = new Date().getHours(); // Get the current hour (0-23)
  
      if (currentHour >= 6 && currentHour < 12) {
        this.currentTimeOfDay = 'Morning';
      } else if (currentHour >= 12 && currentHour < 18) {
        this.currentTimeOfDay = 'Afternoon';
      } else {
        this.currentTimeOfDay = 'Night';
      }
    }
}
