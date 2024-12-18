import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-select',
  imports:[CommonModule,FormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements OnInit {
  universities: any[] = []; // List of available universities
  selectedUniversities: any[] = []; // List of selected universities
  searchTerm: string = ''; // Search term for filtering
  manualUniversityName: string = ''; // Input for manually adding a university

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.searchUniversities(); // Load initial list of universities
  }

  // Fetch universities from API
  searchUniversities(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.universities = data; // Populate universities list
      },
      (error) => {
        console.error('Error fetching universities:', error);
      }
    );
  }

  // Add a selected university to the list
  addUniversity(university: any): void {
    if (
      university &&
      !this.selectedUniversities.some((u) => u.name === university.name)
    ) {
      this.selectedUniversities.push(university); // Add university
    }
  }

  // Add a manually entered university to the list
  addManualUniversity(): void {
    if (!this.manualUniversityName.trim()) {
      alert('Please enter a valid university name.');
      return;
    }

    // Check if the university already exists
    const exists = this.selectedUniversities.some(
      (u) => u.name === this.manualUniversityName
    );

    if (!exists) {
      this.selectedUniversities.push({
        name: this.manualUniversityName,
      });
      this.manualUniversityName = ''; // Clear the input field
    } else {
      alert('This university is already in the selected list.');
    }
  }

  // Remove a university from the list
  removeUniversity(university: any): void {
    this.selectedUniversities = this.selectedUniversities.filter(
      (u) => u.name !== university.name
    );
  }

  // Handle selection from the dropdown
  onUniversitySelect(event: Event): void {
    const target = event.target as HTMLSelectElement; // Cast the target
    const selectedName = target.value; // Get the selected university name
    const university = this.universities.find((u) => u.name === selectedName);

    if (university) {
      this.addUniversity(university); // Add the university
    }
  }

  // Clear the search input
  clearSearch(): void {
    this.searchTerm = ''; // Reset the search term
    this.searchUniversities(); // Reload universities
  }

  // Clear all selected universities
  clearSelectedUniversities(): void {
    this.selectedUniversities = []; // Empty the selected universities array
  }

  // Generate and download a CSV of selected universities
  downloadSelectedUniversities(): void {
    if (this.selectedUniversities.length === 0) {
      alert('No universities selected to download.');
      return;
    }
  
    // Convert selected universities to CSV format
    const csvData = this.selectedUniversities
      .map(
        (university) =>
          `${university.name},${university.web_pages},${university.domains},${university.alpha_two_code},${university.country}` // Include name and web page
      )
      .join('\n');
  
    // Add a header row
    const header = 'Name,Website,Domain,alpha_two_code,Country\n';
  
    // Create a Blob from the CSV data
    const blob = new Blob([header + csvData], {
      type: 'text/csv',
    });
  
    // Create a temporary download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'University.csv'; // File name for the CSV
    a.click();
  
    // Clean up the object URL
    window.URL.revokeObjectURL(url);
  }  
}