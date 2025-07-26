import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from './product.model';
import { Observable } from 'rxjs';

// Used for paginated response
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  searchProducts(
    name: string | null,
    minPrice: number | null,
    maxPrice: number | null,
    page: number = 0,
    size: number = 10,
    sort: string = 'name',
    direction: 'asc' | 'desc' = 'asc'
  ): Observable<PageResponse<Product>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('direction', direction);

    if (name) params = params.set('name', name);
    if (minPrice !== null && minPrice !== undefined) {
      params = params.set('minPrice', minPrice.toString());
    }
    if (maxPrice !== null && maxPrice !== undefined) {
      params = params.set('maxPrice', maxPrice.toString());
    }

    return this.http.get<PageResponse<Product>>(`${this.baseUrl}/search`, { params });
  }

  // Filter-based product search
  filterProducts(
    minPrice: number | null,
    maxPrice: number | null,
    hasDiscount: boolean | null,
    quantityGt: number | null,
    searchText: string | null,
    name: string | null
  ): Observable<Product[]> {
    let params = new HttpParams();

    if (minPrice != null) params = params.set('minPrice', minPrice.toString());
    if (maxPrice != null) params = params.set('maxPrice', maxPrice.toString());
    if (hasDiscount != null) params = params.set('hasDiscount', hasDiscount.toString());
    if (quantityGt != null) params = params.set('quantityGt', quantityGt.toString());
    if (searchText) params = params.set('searchText', searchText);
    if (name) params = params.set('name', name);

    return this.http.get<Product[]>(`${this.baseUrl}/filter`, { params });
  }

}

