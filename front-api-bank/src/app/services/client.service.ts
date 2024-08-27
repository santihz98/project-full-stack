import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../interface/client.model';
import { Account } from '../interface/account.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;
  private account = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) {}

  // Obtener todas las cuentas de un cliente por ID
  getClientAccounts(clientId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.account}/${clientId}`);
  }

  // Obtener todos los clientes
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  // Obtener un cliente por ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo cliente
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  // Eliminar un cliente por ID
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
