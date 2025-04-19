import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-supply-management',
  standalone: false,
  templateUrl: './supply-management.component.html',
  styleUrls: ['./supply-management.component.css']
})
export class SupplyManagementComponent {
  orderRequests: any[] = [];
  suppliers: any[] = [];
  orderForm: FormGroup;
  supplierForm: FormGroup;
  isEditingOrder = false;
  currentEditingOrderId: string | null = null;
  @Input() selectedSection: string|null = null;

  constructor(private firestore: Firestore, private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      itemName: ['', Validators.required],
      drugCategory: ['', Validators.required],
      quantity: [0, Validators.required],
      unit: ['', Validators.required],
      stregnth: [''],
      neededBy: ['', Validators.required],
      supplierId: ['', Validators.required]
    });

    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      contact: ['', Validators.required],
      address: [''],
      email: ['', [Validators.email]]
    });
  }

  ngOnInit() {
    this.fetchOrders();
    this.fetchSuppliers();
  }

  // Fetch Order Requests from Firestore
  fetchOrders() {
    const ordersCollection = collection(this.firestore, 'orderRequests');
    collectionData(ordersCollection, { idField: 'id' }).subscribe(data => {
      this.orderRequests = data;
    });
  }

  // Fetch Suppliers from Firestore
  fetchSuppliers() {
    const supplierCollection = collection(this.firestore, 'suppliers');
    collectionData(supplierCollection, { idField: 'id' }).subscribe(data => {
      this.suppliers = data;
    });
  }

  // Add a new Order Request
  submitOrder() {
    if (this.orderForm.invalid) {
      return;
    }
  
    const orderData = {
      ...this.orderForm.value,
      createdDate: serverTimestamp() // Use server timestamp
    };
  
    if (this.isEditingOrder && this.currentEditingOrderId) {
      // Update logic
      const orderDocRef = doc(this.firestore, 'orderRequests', this.currentEditingOrderId);
      updateDoc(orderDocRef, orderData).then(() => {
        alert('Order updated successfully!');
        this.fetchOrders(); // Refresh after update
      });
    } else {
      // Add new order
      const ordersCollection = collection(this.firestore, 'orderRequests');
      addDoc(ordersCollection, orderData)
        .then(() => {
          alert('Order added successfully!');
          this.fetchOrders(); // Refresh after insert
        })
        .catch((error) => {
          console.error('Error adding order:', error);
        });
    }
  
    this.orderForm.reset();
    this.isEditingOrder = false;
    this.currentEditingOrderId = null;
  }

  // Edit an Order Request
  editOrder(order: any) {
    this.orderForm.patchValue(order);
    this.isEditingOrder = true;
    this.currentEditingOrderId = order.id;
  }

  // Delete an Order Request
  deleteOrder(orderId: string) {
    const orderDocRef = doc(this.firestore, 'orderRequests', orderId);
    deleteDoc(orderDocRef)
      .then(() => {
        alert('Order deleted successfully!');
        this.fetchOrders(); // Re-fetch the orders
      })
      .catch((error) => {
        console.error('Error deleting order:', error);
      });
  }

  // Add a new Supplier
  saveSupplier() {
    if (this.supplierForm.invalid) {
      return;
    }

    const supplierData = this.supplierForm.value;
    const supplierCollection = collection(this.firestore, 'suppliers');

    addDoc(supplierCollection, supplierData)
      .then(() => {
        alert('Supplier added successfully!');
        this.fetchSuppliers(); // Re-fetch the suppliers
      })
      .catch((error) => {
        console.error('Error adding supplier:', error);
      });

    this.supplierForm.reset();
  }

  // Edit Supplier logic (similar to orders, if needed)
  editSupplier(supplier: any) {
    this.supplierForm.patchValue(supplier);
  }

  // Delete Supplier logic
  deleteSupplier(supplierId: string) {
    const supplierDocRef = doc(this.firestore, 'suppliers', supplierId);
    deleteDoc(supplierDocRef)
      .then(() => {
        alert('Supplier deleted successfully!');
        this.fetchSuppliers(); // Re-fetch the suppliers
      })
      .catch((error) => {
        console.error('Error deleting supplier:', error);
      });
  }
  showOrderForm = false;

cancelOrderForm() {
  this.orderForm.reset();
  this.isEditingOrder = false;
  this.currentEditingOrderId = null;
  this.showOrderForm = false;
}
}
