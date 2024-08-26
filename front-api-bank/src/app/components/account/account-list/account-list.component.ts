import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { ClientService } from '../../../services/client.service';
import { CommonModule } from '@angular/common';
import { Client } from '../../../interface/client.model';
import { Account } from '../../../interface/account.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css',
})
export class AccountListComponent {
  @Output() accountCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  accountForm: FormGroup;
  clients: Client[] = [];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private clientService: ClientService
  ) {
    this.accountForm = this.fb.group({
      clientId: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.minLength(6)]],
      accountType: ['', Validators.required],
      initialBalance: ['', [Validators.required, Validators.min(0)]],
      status: [true],
    });
  }

  ngOnInit(): void {
    this.loadActiveClients();
  }

  loadActiveClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
      },
      error: (err) => {
        console.error('Error fetching clients:', err);
      },
    });
  }

  createAccount(): void {
    if (this.accountForm.valid) {
      const formValue = this.accountForm.value;

      const newAccount: Account = {
        accountNumber: formValue.accountNumber,
        accountType: formValue.accountType,
        initialBalance: formValue.initialBalance,
        status: formValue.status,
        client: { id: formValue.clientId } as Client,
      };

      this.accountService.createAccount(newAccount).subscribe({
        next: () => {
          this.accountCreated.emit();
        },
        error: (err) => {
          console.error('Error creating account:', err);
        },
      });
    }
  }

  cancelModal(): void {
    this.cancel.emit();
  }
}
