import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  templateUrl: './order-create.component.html'
})
export class OrderCreateComponent implements OnInit {
  orderForm: FormGroup;
  showSuccessModal = false;
  createdOrder: any = null;
  private static orderIdCounter = 2000;

  availableProducts: any[] = [];


  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.orderForm = this.fb.group({
      institutionName: ['', [Validators.required, Validators.minLength(2)]],
      deliveryAddress: ['', [Validators.required, Validators.minLength(2)]],
      deliveryDate: ['', Validators.required],
      contact: [''],
      phone: [''],
      products: this.fb.array([
        this.fb.group({
          product: ['', Validators.required],
          quantity: [1, [Validators.required, Validators.min(1)]]
        })
      ]),
      notes: ['']
    });
  }

  get productsArray(): FormArray {
    return this.orderForm.get('products') as FormArray;
  }

  addProduct() {
    if (this.productsArray.length < 5) {
      this.productsArray.push(this.fb.group({
        product: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]]
      }));
    }
  }

  removeProduct(index: number) {
    if (this.productsArray.length > 1) {
      this.productsArray.removeAt(index);
    }
  }

  getAvailableProducts() {
    return this.availableProducts.filter(item => item.stock > 0);
  }

  getProductStock(productName: string): number {
    const product = this.availableProducts.find(item => item.name === productName);
    return product ? product.stock : 0;
  }

  getStockClass(stock: number): string {
    if (stock < 10) return 'low-stock';
    if (stock < 25) return 'medium-stock';
    return 'good-stock';
  }

  onProductChange(index: number) {
    const productControl = this.productsArray.at(index);
    const selectedProduct = productControl.get('product')?.value;
    
    // Reset quantity when product changes
    productControl.get('quantity')?.setValue(1);
    
    // Update max quantity based on selected product
    if (selectedProduct && selectedProduct.trim() !== '') {
      const maxStock = this.getProductStock(selectedProduct);
      const quantityControl = productControl.get('quantity');
      if (quantityControl && quantityControl.value > maxStock) {
        quantityControl.setValue(maxStock);
      }
    }
  }

  // Simulate real-time inventory updates
  updateInventoryStock() {
    // In a real application, this would fetch from the server
    // For demo purposes, we'll simulate some stock changes
    this.availableProducts.forEach(product => {
      // Simulate small random stock changes
      const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      product.stock = Math.max(0, product.stock + change);
    });
  }

  isFormValid(): boolean {
    // Check if basic form fields are valid
    const institutionName = this.orderForm.get('institutionName');
    const deliveryAddress = this.orderForm.get('deliveryAddress');
    const deliveryDate = this.orderForm.get('deliveryDate');
    
    if (!institutionName?.valid || !deliveryAddress?.valid || !deliveryDate?.valid) {
      return false;
    }
    
    // Check if at least one product has a valid selection
    for (let i = 0; i < this.productsArray.length; i++) {
      const productGroup = this.productsArray.at(i);
      const product = productGroup.get('product')?.value;
      const quantity = productGroup.get('quantity')?.value;
      
      if (product && product.trim() !== '' && quantity && quantity > 0) {
        return true;
      }
    }
    
    return false;
  }

  createOrder() {
    if (this.isFormValid()) {
      const formValue = this.orderForm.value;
      const selectedProducts = formValue.products.filter((p: any) => p.product && p.product.trim() !== '' && p.quantity && p.quantity > 0);
      const productText = selectedProducts.map((p: any) => `${p.product} (${p.quantity})`).join(', ');
      
      // Increment the counter and create the order
      OrderCreateComponent.orderIdCounter++;
      this.createdOrder = {
        id: 'C-' + OrderCreateComponent.orderIdCounter,
        product: productText,
        date: new Date().toISOString().split('T')[0],
        status: 'Creado',
        institutionName: formValue.institutionName,
        deliveryAddress: formValue.deliveryAddress,
        deliveryDate: formValue.deliveryDate
      };

      this.showSuccessModal = true;
      document.body.classList.add('modal-open');
      
      // Clear form after successful order creation
      this.clearForm();
    } else {
      alert('Por favor complete todos los campos requeridos');
    }
  }

  clearForm() {
    // Clear products array first
    this.productsArray.clear();
    
    // Reset the form with default values
    this.orderForm.reset({
      institutionName: '',
      deliveryAddress: '',
      deliveryDate: '',
      contact: '',
      phone: '',
      notes: ''
    });
    
    // Add one empty product after reset
    this.productsArray.push(this.fb.group({
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    }));
    
    // Force form to be invalid after clearing
    this.orderForm.markAsUntouched();
    this.orderForm.markAsPristine();
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.createdOrder = null;
    document.body.classList.remove('modal-open');
  }
}
