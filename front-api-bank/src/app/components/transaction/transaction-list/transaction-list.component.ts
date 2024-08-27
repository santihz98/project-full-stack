import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { Client } from '../../../interface/client.model';
import { Account } from '../../../interface/account.model';
import { NewTransaction } from '../../../interface/new-transaction.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
})
export class TransactionListComponent implements OnInit {
  transactionForm: FormGroup;
  clients: Client[] = [];
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];

  @Output() closeModal = new EventEmitter<void>();
  @Output() transactionCreated = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private accountService: AccountService
  ) {
    this.transactionForm = this.fb.group({
      clientId: ['', Validators.required],
      accountId: ['', Validators.required],
      transactionType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadAccounts();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
      },
      error: (error) => {
        console.error('Error fetching clients', error);
      },
    });
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (data: Account[]) => {
        this.accounts = data;
      },
      error: (error: any) => {
        console.error('Error fetching accounts', error);
      },
    });
  }

  onClientChange(event: any): void {
    const clientId = Number(event.target.value);
    console.log(clientId);
    if (clientId) {
      this.filteredAccounts = this.accounts.filter(
        (account) => account.client?.id === clientId
      );
    } else {
      this.filteredAccounts = [];
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const transactionData = this.transactionForm.value;

      const newTransaction: NewTransaction = {
        account: { id: transactionData.accountId },
        transactionType: transactionData.transactionType,
        amount: transactionData.amount,
        date: transactionData.date,
      };

      this.transactionService.createTransaction(newTransaction).subscribe({
        next: () => {
          alert('Transacción creada exitosamente');
          this.transactionForm.reset();
          this.transactionCreated.emit();
          this.closeModal.emit();
        },
        error: (error: any) => {
          alert('Hubo un error al crear la transacción');
        },
      });
    }
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
