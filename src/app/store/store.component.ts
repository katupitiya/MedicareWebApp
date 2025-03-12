import { Component, inject } from '@angular/core';
import { CollectionReference, Firestore, Timestamp, addDoc, collection, collectionData, doc, updateDoc,deleteDoc } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-store',
  standalone: false,
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {

  showPrescriptionForm = false; //enable prescription form

  db: Firestore = inject(Firestore);
  
  prescriptionCollection = collection(this.db, 'pharmacyPrescription'); // use in prescription submit form 
  prescription = { id:'',dname: '', pname: '', page:''}; 
  myForm: FormGroup;

  constructor() {
    this.myForm = new FormGroup({
       dname: new FormControl(''), // Initial value
       pname: new FormControl(''),
       page: new FormControl(''),
     });
   }

  addPrescriptionData(){
     this.showPrescriptionForm = true;
  }


  addNewPrescription() {
    if (this.myForm.valid) {
      this.addPrescriptionDB(this.myForm.value)
        .then(() => {
          alert('Record added successfully!');
          this.myForm.reset(); //Reset the form after submission
        })
        .catch();
    } else {
      alert('Please fill in all fields correctly.');
    }
  }

async addPrescriptionDB(prescription: { dname: string; pname: string; page: string }) {
  try {
    const docRef = await addDoc(this.prescriptionCollection, prescription);
    console.log('record added with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding:', error);
  }
}
}
