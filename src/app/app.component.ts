import { Component } from '@angular/core';
import { InventoryComponent } from './inventory/inventory.component';
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
  inventoryComponent =false;
  inventDrugComponent=false;
  selectedSection: string = 'manage'; // Default section
  showPatientComponent = false;
  showPatientOrderList=false;
  parentMessage='test';

  toggleComponent() {
    this.showComponent = !this.showComponent; // Toggle visibility on button click
  }
  showinventComponent(){
    this.selectedSection = 'manage';
    console.log('InventoryComponent - selectedSection:', this.selectedSection);
    this.inventoryComponent = !this.inventoryComponent;
    this.inventDrugComponent = false;
  }
  showinventDrugComponent(){
    this.selectedSection = 'categories';
    console.log('InventoryComponent - selectedSection ww:', this.selectedSection);
    this.inventoryComponent = false;
    this.inventDrugComponent = !this.inventDrugComponent;
  }

  patientComponentOrder(){
     this.showPatientComponent = !this.showPatientComponent;
  }

}
