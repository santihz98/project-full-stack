import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../interface/transaction.model';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [TransactionListComponent],
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.css',
})
export default class TransactionDetailComponent {
  transactions: Transaction[] = [];
  showCreateTransactionModal = false;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (data: Transaction[]) => {
        this.transactions = data;
      },
      error: (error) => {
        console.error('Error fetching transactions', error);
      },
      complete: () => {
        console.log('Transaction data fetching completed');
      },
    });
  }

  deleteTransaction(id: number): void {
    this.transactionService.deleteTransaction(id).subscribe({
      next: () => {
        this.transactions = this.transactions.filter(
          (transaction) => transaction.id !== id
        );
        console.log(`Transaction with ID ${id} deleted successfully`);
      },
      error: (error) => {
        console.error(`Error deleting transaction with ID ${id}`, error);
      },
      complete: () => {
        console.log('Delete transaction operation completed');
      },
    });
  }

  openCreateTransactionModal() {
    this.showCreateTransactionModal = true;
  }

  closeCreateTransactionModal() {
    this.showCreateTransactionModal = false;
  }

  onTransactionCreated() {
    this.loadTransactions();
  }
}
