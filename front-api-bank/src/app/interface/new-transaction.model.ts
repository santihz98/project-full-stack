export interface NewTransaction {
  id?: number;
  date: string;
  transactionType: string;
  amount: number;
  account: { id: number };
}
