import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../interface/transaction.model';
import { NewTransaction } from '../interface/new-transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  // Obtener todas las transacciones
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  // Obtener una transacción por ID
  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva transacción
  createTransaction(transaction: NewTransaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  // Eliminar una transacción por ID
  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener transacciones por rango de fechas y cuenta
  getTransactionsByDateRange(
    accountId: number,
    startDate: string,
    endDate: string
  ): Observable<Transaction[]> {
    const url = `${this.apiUrl}/report?accountId=${accountId}&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<Transaction[]>(url);
  }
}
