import { Component, OnInit,Input,SimpleChanges  } from '@angular/core';
import { FormBuilder, FormGroup,Validators  } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-inventory',
  standalone:false,
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  inventoryItems: any[] = [];
  expandedItemId: string | null = null;
  filters = {
    productName: '',
    manufacturer: '',
    problemCondition: '',
    category: ''
  };
  myForm: FormGroup;
  showInventoryForm = false;
  isEditing = false;
  currentEditingItemId: string | null = null;
  @Input() selectedSection: string|null = null;
  
   // Declare necessary properties
   drugs: any[] = [];
   showDrugForm: boolean = false;
   isFormEditing: boolean = false;
   currentEditingDrugId: string | null = null;
   searchCriteria = {
     drugName: '',
     description: ''
   };
   drugForm: FormGroup;
   inventoryComponent =false;
   inventDrugComponent=false;
  constructor(private firestore: Firestore, private fb: FormBuilder) {
    console.log('InventoryComponent test', this.selectedSection);
    this.myForm = this.fb.group({
      name: [''],
      manufacturer: [''],
      problemCondition: [''],
      category: [''],
      quantity: ['']
    });
    
     // Initialize the form with validations
     this.drugForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      quantity: [0, Validators.required]
    });
    if (this.selectedSection === 'manage '){
      this.inventoryComponent = true;
     } 
     if (this.selectedSection === 'categories'){
      this.inventDrugComponent = true;
     } 
    console.log('InventoryComponent - selectedSectionnn9:', this.selectedSection);
  }

  ngOnInit() {
    this.fetchInventoryItems();
        // Fetch drugs on component initialization
    this.fetchDrugs();
    if (this.selectedSection === 'manage '){
      console.log('InventoryComponent - selectedSectionnn10:', 'here4');
      this.inventoryComponent = true;
     } 
     if (this.selectedSection === 'categories'){
      console.log('InventoryComponent - selectedSectionnn10:', 'here');
      this.inventDrugComponent = true;
     } 

    console.log('InventoryComponent - selectedSectionnn10:', this.selectedSection);
    //console.log('InventoryComponent - selectedSection w999:', this.selectedSection);
  }
 

  ngOnChanges(changes: SimpleChanges) {
    console.log('InventoryComponent - selectedSection changed:', this.selectedSection); // ✅ Debugging
  }
  fetchInventoryItems() {
    const inventoryCollection = collection(this.firestore, 'inventoryItems');
    collectionData(inventoryCollection, { idField: 'id' }).subscribe(data => {
      this.inventoryItems = data;
    });
  }

  applyFilter() {
    this.fetchInventoryItems();
    this.inventoryItems = this.inventoryItems.filter(item =>
      (!this.filters.productName || item.name.toLowerCase().includes(this.filters.productName.toLowerCase())) &&
      (!this.filters.manufacturer || item.manufacturer.toLowerCase().includes(this.filters.manufacturer.toLowerCase())) &&
      (!this.filters.problemCondition || item.problemCondition.toLowerCase().includes(this.filters.problemCondition.toLowerCase())) &&
      (!this.filters.category || item.category.toLowerCase().includes(this.filters.category.toLowerCase()))
    );
  }

  toggleExpand(item: any) {
    this.expandedItemId = this.expandedItemId === item.id ? null : item.id;
  }

  addItem() {
    this.showInventoryForm = true;
    this.isEditing = false;
    this.currentEditingItemId = null;
    this.myForm.reset();
  }

  async saveItem() {
    if (this.isEditing && this.currentEditingItemId) {
      // Update existing item logic (optional)
    } else {
      try {
        const inventoryCollection = collection(this.firestore, 'inventoryItems');
        await addDoc(inventoryCollection, this.myForm.value);
        alert('Item added successfully!');
        this.fetchInventoryItems();
        this.showInventoryForm = false;
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  }

  editItem(item: any) {
    this.myForm.patchValue(item);
    this.showInventoryForm = true;
    this.isEditing = true;
    this.currentEditingItemId = item.id;
  }

  async deleteItem(id: string) {
    try {
      await deleteDoc(doc(this.firestore, 'inventoryItems', id));
      alert('Item deleted successfully!');
      this.fetchInventoryItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
  
  /**
   * Fetches drugs from Firestore and populates the drugs array.
   */
  fetchDrugs() {
    const drugCollection = collection(this.firestore, 'drugs');
    collectionData(drugCollection, { idField: 'id' }).subscribe(data => {
      this.drugs = data;
    });
  }

  /**
   * Applies search criteria to the drug list based on user input.
   */
  applySearch() {
    this.fetchDrugs(); // Re-fetch drugs to reset the list
    this.drugs = this.drugs.filter(drug =>
      (!this.searchCriteria.drugName || drug.name.toLowerCase().includes(this.searchCriteria.drugName.toLowerCase())) &&
      (!this.searchCriteria.description || drug.description.toLowerCase().includes(this.searchCriteria.description.toLowerCase()))
    );
  }

  /**
   * Opens the form to add a new drug.
   */
  addDrug() {
    this.showDrugForm = true;
    this.isEditing = false;
    this.currentEditingDrugId = null;
    this.drugForm.reset(); // Reset the form for a new drug
  }

  /**
   * Saves the new or edited drug to Firestore.
   */
  async saveDrug() {
    if (this.isEditing && this.currentEditingDrugId) {
      // Update existing drug logic (you can add the logic here if needed)
      console.log('Drug updated:', this.drugForm.value);
    } else {
      try {
        const drugCollection = collection(this.firestore, 'drugs');
        await addDoc(drugCollection, this.drugForm.value);
        alert('Drug added successfully!');
        this.fetchDrugs(); // Re-fetch the updated list
        this.showDrugForm = false; // Close the form
      } catch (error) {
        console.error('Error adding drug:', error);
      }
    }
  }

  /**
   * Opens the form to edit an existing drug.
   * @param drug - The drug to be edited.
   */
  editDrug(drug: any) {
    this.drugForm.patchValue(drug); // Populate the form with existing drug data
    this.showDrugForm = true;
    this.isEditing = true;
    this.currentEditingDrugId = drug.id;
  }

  /**
   * Deletes a drug based on its ID.
   * @param id - The ID of the drug to be deleted.
   */
  async deleteDrug(id: string) {
    try {
      await deleteDoc(doc(this.firestore, 'drugs', id));
      alert('Drug deleted successfully!');
      this.fetchDrugs(); // Re-fetch the updated list
    } catch (error) {
      console.error('Error deleting drug:', error);
    }
  }

  /**
   * Expands or collapses the drug details (for additional UI functionality).
   * @param drug - The drug item to expand or collapse.
   */

}
