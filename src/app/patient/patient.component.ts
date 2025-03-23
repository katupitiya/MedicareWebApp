import { Component, inject, Input } from '@angular/core';
import { CollectionReference, Firestore, Timestamp, addDoc, collection, collectionData, doc, updateDoc,deleteDoc, docData } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

//View records for firebase
export interface Prescription{
  id?:string;
  dname?: string;
  pname?: string;
  page?: string;
  pemail?:string;
  pno?:string;
  pdate?:string;
  pdays?:string;
  pres?:string;
  status?:string;
}

@Component({
  selector: 'app-patient',
  standalone: false,
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})

export class PatientComponent {

 // @Input() message: string = ''; 
  //component visibility
  orderMedicine ;
  //mainpage;
  orderList;
  showPatientManagment= false; //enable patient managment section
  PrescriptionRecords: Prescription[] = [];//view list
  editPrescriptionRecordId:any;
  editPrescriptionRecord: any;

  editForm: FormGroup;
  isVisible: boolean = false;

  selectedFile: File | null = null;
   db: Firestore = inject(Firestore);
   imageUrl: string | null = null;
    
    prescriptionCollection = collection(this.db, 'pharmacyPrescription'); // use in prescription submit form 
    prescription = { id:'',dname: '', pname: '', page:'',gend:'',pemail:'',pno:'',pdate:'',pdays:'',pres:'',status:''}; 
    myForm: FormGroup;
    //editPrescriptionRecord!: Prescription;

    constructor() {
      
     this.orderMedicine = false;
     //this.mainpage= true;
     this.orderList= true;

      this.myForm = new FormGroup({
         dname: new FormControl(''), // Initial value
         pname: new FormControl(''),
         page: new FormControl(''),
         gend:new FormControl(''),
         pemail:new FormControl(''),
         pno:new FormControl(''),
         pdate:new FormControl(''),
         pdays:new FormControl(''),
         pres:new FormControl(''),
         status:new FormControl(''),
       });

       this.editForm = new FormGroup({
        dname: new FormControl(''), // Initial value
        pname: new FormControl(''),
        page: new FormControl(''),
        gend:new FormControl(''),
        pemail:new FormControl(''),
        pno:new FormControl(''),
        pdate:new FormControl(''),
        pdays:new FormControl(''),
        pres:new FormControl(''),
        status:new FormControl(''),
      });
     }
  
   
    addNewPrescription() {
      this.myForm.value.pres=this.imageUrl;
      this.myForm.value.status='Submitted';
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
  
  async addPrescriptionDB(prescription: { dname: string; pname: string; page: string;gend:string,pemail:string,pno:string,pdate:string,pdays:string;pres:string;status:string}) {
    try {
      const docRef = await addDoc(this.prescriptionCollection, prescription);
      console.log('record added with ID:', docRef.id);
    } catch (error) {
      console.error('Error adding:', error);
    }
  }

  //message: string = '';

 

  uploadImage(event: any) {
    console.log('janani');
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Prescriptions'); // Get this from Cloudinary settings
    formData.append('folder', 'Prescriptions'); // Folder inside "home"

    fetch('https://api.cloudinary.com/v1_1/ddlongyz4/image/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      this.imageUrl = data.secure_url; // Get the Cloudinary image URL
      console.log('imageUrl'+this.imageUrl);
    })
    .catch(error => console.error('Upload Error:', error));
  }

  //
  orderMedicinefunction(){
      this.orderMedicine = true;
      //this.mainpage = false;
      this.orderList=false;
      
  }
  orderListfunction(){
    this.orderMedicine = false;
    //this.mainpage = false;
    this.orderList= true;
    this.showEditModal = false;
  }

  Homefunction(){
    this.orderMedicine = false;
    // this.mainpage= true;
     this.orderList= false;
  }
 
  //View record list
  getPrescriptionDetails(): Observable<Prescription[]> {
    const dataCollection = collection(this.db, 'pharmacyPrescription');
    return collectionData(dataCollection, { idField: 'id' }) as Observable<Prescription[]>;
  }
  
  ngOnInit() {
    this.getPrescriptionDetails().subscribe((data) => {
      this.PrescriptionRecords = data;
      console.log('Data retrieved:', this.PrescriptionRecords);
    });
  }

  //Delete Records
  async deleteRecords(pres:Prescription){
      if (!pres.id) {
        console.error('Error: ID is missing.');
        return;
      }
  
      try {
        const DocRef = doc(this.db, 'pharmacyPrescription', pres.id); // Reference the document
        await deleteDoc(DocRef); //  Delete the document
        console.log('deleted successfully!');
        this.getPrescriptionDetails().subscribe((data) => {
          this.PrescriptionRecords = data;
          console.log('Data retrieved:', this.PrescriptionRecords);
        });
  
        // Update local list
       // this.PrescriptionRecords = this.PrescriptionRecords.filter(pres => pres.id !== pres.id);
      } catch (error) {
        console.error('Error deleting :', error);
      }
    
  }

  showEditModal = false;

  getPrescriptionById(presId: string): Observable<any> {
    const presRef = doc(this.db, 'pharmacyPrescription', presId);
    return docData(presRef, { idField: 'id' }); // Auto-adds the document ID
  }

  
   EditRecordModal(pres:Prescription) {
    
    this.editPrescriptionRecordId = pres.id;
    console.log('editPrescriptionRecordId::'+ this.editPrescriptionRecordId);
    this.showEditModal = true;
   
  this.getPrescriptionById(this.editPrescriptionRecordId).subscribe((data) => {
    this.editPrescriptionRecord = data;
    console.log('Prescription Details:', this.editPrescriptionRecord.page);
  });

  }

  closeModal() {
    this.isVisible = false;
  }

  async onUpdateClick() {
    this.editForm.value.pres=this.imageUrl;
    this.editForm.value.status='Submitted';
   if (!this.editPrescriptionRecordId) {
      console.error('Error:  ID is missing.');
      return;
    }
  
    try {
      const movieDocRef = doc(this.db, 'pharmacyPrescription', this.editPrescriptionRecordId); // Correct Firestore reference
  
      const { id, ...updatedMovie } = this.editForm.value; // Remove `id` before updating
      await updateDoc(movieDocRef, updatedMovie); // Correct update method
  
      console.log('updated successfully!');
    } catch (error) {
      console.error('Error updating :', error);
    }
    this.orderListfunction();
  }
  
}

