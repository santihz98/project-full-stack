export interface Report {
  client: {
    id: number;
    name: string;
  };
  accounts: Array<{
    accountNumber: string;
    initialBalance: number;
    availableBalance: number;
    totalCredits: number;
    totalDebits: number;
  }>;
  pdfBase64: string;
}
