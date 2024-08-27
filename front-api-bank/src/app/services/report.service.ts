import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  // Obtener el reporte en formato JSON o PDF (Base64)
  getReport(
    clientId: number,
    startDate: string,
    endDate: string,
    format: string
  ): Observable<string> {
    const url = `${this.apiUrl}?clientId=${clientId}&startDate=${startDate}&endDate=${endDate}&format=${format}`;
    return this.http.get(url, { responseType: 'text' });
  }
}
