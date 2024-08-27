import { Client } from './client.model';

export interface Account {
  id?: number;
  accountNumber: string;
  accountType: string;
  initialBalance: number;
  availableBalance?: number;
  status: boolean;
  client: Client;
}
