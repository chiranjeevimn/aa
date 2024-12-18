import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [ CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  products: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  totalItems = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.totalItems = data.length;  // Set the total number of items for pagination
    });
  }

  // Calculate the total number of pages
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Generate an array of page numbers to display
  get pageNumbers(): number[] {
    let start = Math.max(1, this.currentPage - 2); // Show 2 pages before the current page
    let end = Math.min(this.totalPages, this.currentPage + 2); // Show 2 pages after the current page

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  // Paginate the products based on the current page
  paginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Change the page number
  goToPage(page: number): void {
    if (page < 1) {
      this.currentPage = 1;
    } else if (page > this.totalPages) {
      this.currentPage = this.totalPages;
    } else {
      this.currentPage = page;
    }
  }
}
