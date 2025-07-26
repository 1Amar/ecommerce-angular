import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  totalItems = 0;
  totalPages = 0;
  page = 0;
  size = 5;

  sortField = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchForm!: FormGroup;
  isAdvanced = false; // Toggle between basic & advanced

  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // ✅ Initialize search form here
    this.searchForm = this.fb.group({
      name: [''],
      minPrice: [null],
      maxPrice: [null],
      hasDiscount: [null],
      quantityGt: [null],
      searchText: ['']
    });

    // this.loadProducts();

    this.searchProducts();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.searchProducts();
  }

  // loadProducts() {
  //   this.productService.getAll().subscribe((data) => (this.products = data));
  // }

  // deleteProduct(id: number) {
  //   this.productService.delete(id).subscribe(() => this.searchProducts());
  // }

  deleteProduct(id: number) {
    this.productService.delete(id).subscribe(() => this.searchProducts());
  }

  editProduct(id: number) {
    this.router.navigate(['/products/edit', id]);
  }

  addProduct() {
    this.router.navigate(['/products/create']);
  }

  searchProducts(): void {
    const { name, minPrice, maxPrice } = this.searchForm.value;
    this.productService
      .searchProducts(name || '', minPrice, maxPrice, this.page, this.size, this.sortField, this.sortDirection)
      .subscribe((response) => {
        this.products = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
      });

  }

  advancedSearchProducts(): void {
    const { name, minPrice, maxPrice, hasDiscount, quantityGt, searchText } = this.searchForm.value;
    this.productService
      .filterProducts(minPrice, maxPrice, hasDiscount, quantityGt, searchText, name)
      .subscribe((products) => {
        this.products = products;
        this.totalPages = 1;
        this.page = 0;
      });
  }

  resetSearch(): void {
    this.page = 0;
    this.searchForm.reset();
    this.isAdvanced ? this.advancedSearchProducts() : this.searchProducts();
  }



  setSort(field: string) {
    if (this.sortField === field) {
      // Toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    // this.searchProducts();
    this.isAdvanced ? this.advancedSearchProducts() : this.searchProducts();
  }

  onSubmit(): void {
    this.page = 0;
    this.isAdvanced ? this.advancedSearchProducts() : this.searchProducts();
  }

}
