import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreComponent } from './store/store.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { FirestoreModule, getFirestore, provideFirestore} from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment.development';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { UserAuthService } from './user-auth.service';
import { InventoryComponent } from './inventory/inventory.component';
import { SupplyManagementComponent } from './supply-management/supply-management.component';
import { BillingComponent } from './billing/billing.component';
import { PatientComponent } from './patient/patient.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
//import { CloudinaryModule } from '@cloudinary/ng';
//port {Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';

@NgModule({
  declarations: [
    AppComponent,
    StoreComponent,
    InventoryComponent,
    SupplyManagementComponent,
    LoginComponent,    
    BillingComponent,
    PatientComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    
  ],
  providers: [
    FirestoreModule,
    //AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
      // Provide Firebase Auth
      provideAuth(() => getAuth())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
