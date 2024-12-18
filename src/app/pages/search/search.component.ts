import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [CommonModule,FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  products: any[] = []; // Store all products
  selectedProduct: string = ''; // Store selected product name
  selectedProductDetails: any = null; // Store details of the selected product
  filteredProducts = this.products;
  searchTerm: string = '';
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Fetch products from API
    this.productService.getProducts().subscribe((data) => {
      this.products = data; // Assign the API response to products
    });
  }

  // Handle product selection
  onProductChange(): void {
    this.selectedProductDetails = this.products.find(
      (product) => product.name === this.selectedProduct
    );
  }
  filterProducts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
  }
}
