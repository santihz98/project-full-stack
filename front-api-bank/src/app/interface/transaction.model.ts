import { Client } from './client.model';
import { Account } from './account.model';

export interface Transaction {
  id?: number;
  date: string;
  transactionType: string;
  amount: number;
  balance?: number;
  accountId: { id: number };
  account: Account;
  client: Client;
}
