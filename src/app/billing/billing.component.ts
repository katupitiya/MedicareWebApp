import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-billing',
  standalone: false,
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css'
})

export class BillingComponent {
  billingForm: FormGroup;
  medicines: { name: string; quantity: number; price: number }[] = [];
  totalAmount: number = 0;
  isPaid: boolean = false;

  constructor(private fb: FormBuilder) {
    this.billingForm = this.fb.group({
      medicineName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      paymentMethod: ['', Validators.required]
    });
  }

  addMedicine() {
    if (this.billingForm.valid) {
      const { medicineName, quantity, price } = this.billingForm.value;
      this.medicines.push({ name: medicineName, quantity, price });
      this.updateTotal();
      this.billingForm.reset();
    }
  }

  updateTotal() {
    this.totalAmount = this.medicines.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }

  payBill() {
    if (this.billingForm.get('paymentMethod')?.valid) {
      this.isPaid = true;
    }
  }
}