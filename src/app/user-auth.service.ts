import { Injectable } from '@angular/core';
import { UserDetails } from './user-details';
import { Observable, Subject } from 'rxjs';
import { Auth,updateProfile , createUserWithEmailAndPassword, UserCredential,signOut,signInWithEmailAndPassword,onAuthStateChanged, User  } from '@angular/fire/auth';
//declare var firebase: any;


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  loggedInStatus=false;
  constructor(private auth: Auth) { 
    
  }

  async signupUser(user: UserDetails):Promise<{ success: boolean; data?: UserCredential; error?: any }> {
    try{
      const result = await createUserWithEmailAndPassword(this.auth,user.email, user.password);
      console.log("User signed up successfully:", result.user);
      return { success: true, data: result };
    }catch(error){
      console.error("Signup error:", error);
    
    return { success: false, error }; 
}


//working fine
  //  createUserWithEmailAndPassword(this.auth,user.email, user.password)
  //     .catch(function (error:any) {
        // Handle Errors here.
        //var errorCode = error.code;
        //var errorMessage = error.message;
        // ...
      //   console.log(error);
      // });
  }

  logout(): Promise<boolean> {
    return signOut(this.auth)
      .then(() => {
        console.log("User logged out successfully");
        return true;  // ✅ Return true on success
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        return false;  // ❌ Return false on failure
      });
    
    }
  async signinUser(user: UserDetails): Promise<UserCredential> {
 
      try{
        const result=  await signInWithEmailAndPassword(this.auth,user.email, user.password);
        console.log('result='+result);
        if (!result.user.displayName) {
          await this.setDisplayName(result.user, this.auth.name);
        }

        return result; 
      }catch(error:any) {
        // Handle Errors here.
        //var errorCode = error.code;
        //var errorMessage = error.message;
        console.log(error);
        // ...
        throw error;
      };

  }
  async isLogedIn(): Promise<boolean> {
    // onAuthStateChanged(this.auth, (user: User | null) => {
     
    //   if (user) {
    //     console.log('User is logged in:', user);
    //     this.loggedInStatus= true;
    //   } else {
    //     console.log('No user is logged in.');
    //     this.loggedInStatus= false;
    //   }
    //   return  this.loggedInStatus;
    // });
    // return true;


    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user: User | null) => {
        if (user) {
          console.log('User is logged in:', user);
          this.loggedInStatus = true;
        } else {
          console.log('No user is logged in.');
          this.loggedInStatus = false;
        }
        resolve(this.loggedInStatus);
      });
    });
  }
  async setDisplayName(user: User, name: string) {

    if (!user) {
      console.error('No authenticated user found. Cannot update display name.');
      return;
    }
    try {
      // await updateProfile(user, { displayName: name });
      // console.log('Display name updated:', name);

      const auth = this.auth; // ✅ Ensure you use the correct auth instance
      const currentUser = auth.currentUser; // ✅ Fetch the latest user object
  
      if (!currentUser) {
        console.error("Error: No authenticated user found in Firebase.");
        return;
      }
  
      await updateProfile(currentUser, { displayName: name }); // ✅ Use the latest user object
      console.log("Display name updated:", name);
    } catch (error) {
      console.error('Error updating display name:', error);
    }
  }
  // isAuthenticated() {
  //   var user = this.auth().currentUser;
  //   if (user) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }

  // userProfile() {
  //   var user = firebase.auth().currentUser;
  //   var name, email, photoUrl,password, uid, emailVerified;
    
    
  //   if (user != null) {
  //     //name = user.displayName;
  //     email = user.email;
  //     password=user.password;
  //   return user;
  //     //photoUrl = user.photoURL;
  //     //emailVerified = user.emailVerified;
  //     //uid = user.uid;
  //   }
  //   else{
  //     return null;
  //   }
  // }
}
