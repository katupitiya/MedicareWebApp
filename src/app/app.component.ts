import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'MedicareWebApp';

  showComponent = false; // Controls the visibility of MyNewComponent
  showPatientComponent = false;
  showPatientOrderList=false;
  showPharmacyComponent=false;
  showPatientOrderComponent = false;
  parentMessage='test';

  toggleComponent() {
    this.showComponent = !this.showComponent; // Toggle visibility on button click
  }

  patientComponentOrder(){
    this.showPatientOrderComponent = !this.showPatientOrderComponent;
     this.showPatientComponent = true;
     this.showPharmacyComponent = false;
  }

  Pharmacycomponent(){
    this.showPharmacyComponent = !this.showPharmacyComponent;
    this.showPatientComponent=true;
    this.showPatientOrderComponent = false;
  }

  Pharmacycart(){
    this.showPharmacyComponent = !this.showPharmacyComponent;
    this.showPatientComponent=true;
    this.showPatientOrderComponent = false;
  }

}
