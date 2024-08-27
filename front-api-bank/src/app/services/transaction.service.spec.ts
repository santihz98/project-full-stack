import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';
import { environment } from '../../environments/environment';
import { Transaction } from '../interface/transaction.model';
import { NewTransaction } from '../interface/new-transaction.model';
import { Client } from '../interface/client.model';
import { Account } from '../interface/account.model';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  const dummyClient: Client = {
    id: 1,
    name: 'Client 1',
    gender: 'Male',
    age: 30,
    identification: '123456789',
    address: 'Address 1',
    phone: '555-5555',
    clientId: 'client1',
    password: 'password',
    status: true,
  };

  const dummyAccount: Account = {
    id: 1,
    accountNumber: '123456',
    accountType: 'Checking',
    initialBalance: 1000,
    availableBalance: 1200,
    status: true,
    client: dummyClient,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionService],
    });

    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all transactions', () => {
    const dummyTransactions: Transaction[] = [
      {
        id: 1,
        date: '2024-08-26T20:10:00',
        transactionType: 'CREDIT',
        amount: 200.0,
        balance: 1200.0,
        accountId: { id: 1 },
        account: dummyAccount,
        client: dummyClient,
      },
      {
        id: 2,
        date: '2024-08-27T10:15:00',
        transactionType: 'DEBIT',
        amount: 100.0,
        balance: 1100.0,
        accountId: { id: 1 },
        account: dummyAccount,
        client: dummyClient,
      },
    ];

    service.getAllTransactions().subscribe((transactions) => {
      expect(transactions.length).toBe(2);
      expect(transactions).toEqual(dummyTransactions);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/transactions`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTransactions);
  });

  it('should retrieve a transaction by ID', () => {
    const dummyTransaction: Transaction = {
      id: 1,
      date: '2024-08-26T20:10:00',
      transactionType: 'CREDIT',
      amount: 200.0,
      balance: 1200.0,
      accountId: { id: 1 },
      account: dummyAccount,
      client: dummyClient,
    };

    service.getTransactionById(1).subscribe((transaction) => {
      expect(transaction).toEqual(dummyTransaction);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/transactions/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTransaction);
  });

  it('should create a new transaction', () => {
    const newTransaction: NewTransaction = {
      account: { id: 1 },
      transactionType: 'CREDIT',
      amount: 200.0,
      date: '2024-08-26T20:10:00',
    };

    const createdTransaction: Transaction = {
      id: 3,
      date: '2024-08-26T20:10:00',
      transactionType: 'CREDIT',
      amount: 200.0,
      balance: 1400.0,
      accountId: { id: 1 },
      account: dummyAccount,
      client: dummyClient,
    };

    service.createTransaction(newTransaction).subscribe((transaction) => {
      expect(transaction).toEqual(createdTransaction);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/transactions`);
    expect(req.request.method).toBe('POST');
    req.flush(createdTransaction);
  });

  it('should delete a transaction', () => {
    service.deleteTransaction(1).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/transactions/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should retrieve transactions by date range and account', () => {
    const dummyTransactions: Transaction[] = [
      {
        id: 1,
        date: '2024-08-26T20:10:00',
        transactionType: 'CREDIT',
        amount: 200.0,
        balance: 1200.0,
        accountId: { id: 1 },
        account: dummyAccount,
        client: dummyClient,
      },
      {
        id: 2,
        date: '2024-08-27T10:15:00',
        transactionType: 'DEBIT',
        amount: 100.0,
        balance: 1100.0,
        accountId: { id: 1 },
        account: dummyAccount,
        client: dummyClient,
      },
    ];

    const startDate = '2024-08-01T00:00:00';
    const endDate = '2024-08-31T23:59:59';

    service
      .getTransactionsByDateRange(1, startDate, endDate)
      .subscribe((transactions) => {
        expect(transactions.length).toBe(2);
        expect(transactions).toEqual(dummyTransactions);
      });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/transactions/report?accountId=1&startDate=${startDate}&endDate=${endDate}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyTransactions);
  });
});
