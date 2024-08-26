import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../interface/account.model';
import { AccountListComponent } from '../account-list/account-list.component';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [AccountListComponent],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.css',
})
export default class AccountDetailComponent {
  accounts: Account[] = [];
  showModal = false;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
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

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.loadAccounts();
  }
}
