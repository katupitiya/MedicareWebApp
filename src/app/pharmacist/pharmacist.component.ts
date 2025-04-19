import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Prescription } from '../patient/patient.component';
import { addDoc, collection, collectionData, doc, docData, Firestore, query, where } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

//View records for firebase
export interface InventoryItems{
  price: any;
  id?:string;
  category?: string;
  manufacturer?: string;
  name?: string;
  problemCondition?:string;
  quantity?:string;
}

export interface OrderDetails{
  totalPrice: any;
  id?:string;
  cartItems: any;
  manufacturer?: string;
  name?: string;
  problemCondition?:string;
  quantity?:string;
  doctorName ?: string;
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
  selector: 'app-pharmacist',
  standalone: false,
  templateUrl: './pharmacist.component.html',
  styleUrl: './pharmacist.component.css'
})
export class PharmacistComponent {

   // @Input() message: string = ''; 
    //component visibility
    //orderMedicine ;
    //mainpage;
    orderList = true;
    orderListPharmacy= false;
    orderMedicine=true;
    showPatientManagment= false; //enable patient managment section
    PrescriptionRecords: Prescription[] = [];//view list
    editPrescriptionRecordId:any;
    editPrescriptionRecord: any;
    dataRecord:any;
    MedicineRecords: any;
    MedicineRecordsList: InventoryItems[] = [];
    dropdownOptions: any[] = [];
    filteredOptions: any[] = [];
    selectedValue: string = '';
    searchText: string = '';
    MedicineRecords2:any;

  drugDetails: any = null;
  errorMessage: string = '';

  cart: any[] = []; // Shopping cart for added drugs
  totalCost: number = 0;
  //errorMessage: string = '';

    showMedicineAddForm:any;
  
    
    isVisible: boolean = false;
  
    selectedFile: File | null = null;
     db: Firestore = inject(Firestore);
     imageUrl: string | null = null;
      
      prescriptionCollection = collection(this.db, 'pharmacyPrescription'); // use in prescription submit form 
      prescription = { id:'',dname: '', pname: '', page:'',gend:'',pemail:'',pno:'',pdate:'',pdays:'',pres:'',status:''}; 
      InventoryItems = { id:'',category: '', manufacturer: '', name:'',problemCondition:'',quantity:''}; 
      OrderDetails={id:'',dname: '',pname:'',page:'',pemail: '',pno: '',pdate: '',steps: '',timeduration:'',otimeduration:'',drugs: []};
      
     myForm: FormGroup;

constructor(private fb: FormBuilder) {

      /*this.myForm = this.fb.group({
        rows: this.fb.array([this.createRow()]),  // Start with one row
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
        searchText: [''],

      });*/

      this.myForm = this.fb.group({
        dname: [{ value: '', disabled: true }, Validators.required],
        pname: [{ value: '', disabled: true }, Validators.required],
        page: [{ value: '', disabled: true }, Validators.required],
        pemail: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
        pno: [{ value: '', disabled: true }, Validators.required],
        pdate: [{ value: '', disabled: true }, Validators.required],
        steps: [{ value: '', disabled: true }, Validators.required],
        timeduration:[{ value: '', disabled: true }, Validators.required],
        otimeduration:[{ value: '', disabled: true }, Validators.required],
        drugs: this.fb.array([])
      });
      
     this.orderMedicine = false;
     this.orderList= true;
     this.showMedicineAddForm = false;
     

     /*this.myForm = new FormGroup({
            
           });*/

           
           
     }

     searchDrugByName(drugName: string): Observable<InventoryItems[]> {
      const dataCollection = collection(this.db, 'inventoryItems');
      const q = query(dataCollection, where('name', '==', drugName));
      return collectionData(q, { idField: 'id' }) as Observable<InventoryItems[]>;
    }

      //View record list
        getPrescriptionDetails(): Observable<Prescription[]> {
          const dataCollection = collection(this.db, 'pharmacyPrescription');
          return collectionData(dataCollection, { idField: 'id' }) as Observable<Prescription[]>;
        }

        getMedicineDetails(): Observable<InventoryItems[]> {
          const dataCollection = collection(this.db, 'inventoryItems');
          return collectionData(dataCollection, { idField: 'id' }) as Observable<InventoryItems[]>;
        }

        getOrderDetails(): Observable<OrderDetails[]> {
          const dataCollection = collection(this.db, 'prescriptionOrders');
          return collectionData(dataCollection, { idField: 'id' }) as Observable<OrderDetails[]>;
        }
        
        ngOnInit() {
          this.getPrescriptionDetails().subscribe((data) => {
            this.PrescriptionRecords = data;
            console.log('Data retrieved:', this.PrescriptionRecords);
          });

          this.getOrderDetails().subscribe((data) => {
            this.MedicineRecords2 = data;
            console.log('Data retrieved:', this.MedicineRecords2);
          });

          /*this.getMedicineDetails().subscribe((data) => {
            this.MedicineRecords = data;
            this.dropdownOptions = data;
            this.filteredOptions = data;
            console.log('Medicine Data retrieved:', this.MedicineRecords);
          });*/

          this.addRow();

          
          
        }

        get drugs(): FormArray {
          return this.myForm.get('drugs') as FormArray;
        }
      
        addRow() {
          const row = this.fb.group({
            searchText: [''],
            name: [''],
            quantity: [''],
            price: [''],
            orderQuantity: [1, [Validators.required, Validators.min(1)]],
            steps: [''],
            timeduration:[''],
            otimeduration:[''],
          });
          this.drugs.push(row);
        }

        removeRow(index: number) {
          this.drugs.removeAt(index);
        }
      
       /* removeRow(index: number) {
          this.drugs.removeAt(index);
        }
     
        removeRow(index: number) {
          this.drugs.removeAt(index);
        }*/
      
        searchDrug(index: number) {
          const drugName = this.drugs.at(index).get('searchText')?.value.trim();
      
          if (drugName) {
            this.searchDrugByName(drugName).subscribe(data => {
              if (data.length > 0) {
                const drug = data[0];
                this.drugs.at(index).patchValue({
                  name: drug.name,
                  quantity: drug.quantity,
                  price: drug.price
                });
                this.errorMessage = '';
              } else {
                this.errorMessage = 'No drug found';
              }
            });
          } else {
            this.errorMessage = 'Please enter a drug name';
          }
        }
      
        addToCart(index: number) {
          const row = this.drugs.at(index);
          const orderedQuantity = row.get('orderQuantity')?.value;
          const useSteps = row.get('steps')?.value;
          const timeduration=row.get('timeduration')?.value;
          const otimeduration=row.get('otimeduration')?.value;
          console.log('hhhh'+JSON.stringify(useSteps));
          if (orderedQuantity > row.get('quantity')?.value) {
            alert('Ordered quantity exceeds available stock!');
            return;
          }
      
          const newItem = {
            name: row.get('name')?.value,
            price: row.get('price')?.value,
            quantity: orderedQuantity,
            total: row.get('price')?.value * orderedQuantity,
            steps:useSteps,
            timeduration:timeduration,
            otimeduration:otimeduration,
            
          };
          console.log('newItem::'+JSON.stringify(newItem));
          this.cart.push(newItem);
          this.totalCost = this.cart.reduce((sum, item) => sum + item.total, 0);
          row.patchValue({
            searchText: '',
            name: '',
            price: '',
            quantity: '',
            orderQuantity: '',
            steps: '',
            timeduration:'',
            otimeduration:''
          });
        }
      
        removeFromCart(index: number) {
          this.cart.splice(index, 1);
          this.totalCost = this.cart.reduce((sum, item) => sum + item.total, 0);
        }

        addPrescriptionOrder(order: any) {
          console.log('janani order:'+JSON.stringify(order));
          const ordersCollection = collection(this.db, 'prescriptionOrders'); 
          return addDoc(ordersCollection, order);
        }
      
       /* submitOrder() {
          if (this.cart.length === 0) {
            alert('Please add at least one drug to the cart.');
            return;
          }
          console.log('Order Submitted:', this.cart);
          alert('Order Successfully Placed!');
        }
        */

//Download Prescription
downloadImage(imageUrl:any) {
  fetch(imageUrl.pres)
    .then(response => response.blob())  // Convert the image to a blob
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'prescription.jpg'); // Force download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up
    })
    .catch(error => console.error('Error downloading image:', error));
}

submitForm() {
    if (this.myForm.valid) {
      console.log('Form Data:', this.myForm.value);
    }
  }

  get rows(): FormArray {
    return this.myForm.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

 /* addRow() {
    this.rows.push(this.createRow());
  }

  removeRow(index: number) {
    if (this.rows.length > 1) {
      this.rows.removeAt(index);
    }
  }*/
 

    getPrescriptionById(presId: string): Observable<any> {
      const presRef = doc(this.db, 'pharmacyPrescription', presId);
      return docData(presRef, { idField: 'id' }); // Auto-adds the document ID
    }

  approvalMethod(record:any){

    this.orderList = false;
    this.showMedicineAddForm = true;
    //this.dataRecord = record;
    this.editPrescriptionRecordId = record.id;
    console.log('editPrescriptionRecordId::'+ this.editPrescriptionRecordId);
    //this.showEditModal = true;
   
  this.getPrescriptionById(this.editPrescriptionRecordId).subscribe((data) => {
    this.editPrescriptionRecord = data;
    console.log('Prescription Details:', this.editPrescriptionRecord);
  });

  }

  addrecord(){
   
  }

  filterOptions() {
    this.filteredOptions = this.dropdownOptions.filter(option =>
      option.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
 

  selectOption(option: any) {
    this.selectedValue = option.name;
    this.searchText = option.name; // Set the input field to the selected value
    this.filteredOptions = []; // Hide the dropdown list after selection
  }

  /*searchDrug() {
    if (this.searchText.trim() !== '') {
      this.searchDrugByName(this.searchText).subscribe(data => {
        if (data.length > 0) {
          this.drugDetails = data[0];
          this.errorMessage = '';
        } else {
          this.drugDetails = null;
          this.errorMessage = 'No drug found';
        }
      });
    } else {
      this.errorMessage = 'Please enter a drug name';
    }
  }*/

    submitOrder() {
      if (this.cart.length === 0) {
        alert('Please add at least one drug to the cart.');
        return;
      }
  
      const orderData = {
        doctorName: this.myForm.get('dname')?.value || '',
        patientName: this.myForm.get('pname')?.value || '',
        patientAge: this.myForm.get('page')?.value || '',
        patientEmail: this.myForm.get('pemail')?.value || '',
        patientContact: this.myForm.get('pno')?.value || '',
        orderDate: this.myForm.get('pdate')?.value || '',
        cartItems: this.cart,
        totalCost: this.totalCost || 0
      };

      console.log('orderData::'+JSON.stringify(orderData));
  
      this.addPrescriptionOrder(orderData)
        .then(() => {
          alert('Order placed successfully!');
          this.myForm.reset();
          this.cart = [];
          this.totalCost = 0;
        })
        .catch(error => {
          console.error('Error saving order:', error);
          alert('Failed to place order');
        });
    }

    testmethod(){
      this.orderListPharmacy = !this.orderListPharmacy;
      this.orderList = false;
    }

    expandedIndex: number | null = null;
    i: number | null = null;
toggleDetails(index: number) {
  this.expandedIndex = this.expandedIndex === index ? null : index;
}

}
