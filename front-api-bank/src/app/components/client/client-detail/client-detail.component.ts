import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../interface/client.model';
import { ClientListComponent } from '../client-list/client-list.component';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [ClientListComponent],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css',
})
export default class ClientDetailComponent implements OnInit {
  clients: Client[] = [];
  showCreateClientModal = false;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
      },
      error: (error) => {
        console.error('Error fetching clients', error);
      },
      complete: () => {
        console.log('Client data fetching completed');
      },
    });
  }

  deleteClient(id: number): void {
    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.clients = this.clients.filter((client) => client.id !== id);
        console.log(`Client with ID ${id} deleted successfully`);
      },
      error: (error) => {
        console.error(`Error deleting client with ID ${id}`, error);
      },
      complete: () => {
        console.log('Delete client operation completed');
      },
    });
  }

  openCreateClientModal() {
    this.showCreateClientModal = true;
  }

  closeCreateClientModal() {
    this.showCreateClientModal = false;
  }

  onClientCreated() {
    this.loadClients();
  }
}
