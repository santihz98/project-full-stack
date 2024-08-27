import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { Account } from '../interface/account.model';
import { Client } from '../interface/client.model'; // Importa el modelo Client
import { environment } from '../../environments/environment';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;

  // Definimos un cliente dummy que usaremos en las pruebas
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccountService],
    });

    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all accounts', () => {
    const dummyAccounts: Account[] = [
      {
        id: 1,
        accountNumber: '123456',
        accountType: 'Checking',
        initialBalance: 1000,
        availableBalance: 1000,
        status: true,
        client: dummyClient,
      },
      {
        id: 2,
        accountNumber: '654321',
        accountType: 'Savings',
        initialBalance: 2000,
        availableBalance: 2000,
        status: true,
        client: dummyClient,
      },
    ];

    service.getAllAccounts().subscribe((accounts) => {
      expect(accounts.length).toBe(2);
      expect(accounts).toEqual(dummyAccounts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/accounts`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyAccounts);
  });

  it('should retrieve an account by ID', () => {
    const dummyAccount: Account = {
      id: 1,
      accountNumber: '123456',
      accountType: 'Checking',
      initialBalance: 1000,
      availableBalance: 1000,
      status: true,
      client: dummyClient,
    };

    service.getAccountById(1).subscribe((account) => {
      expect(account).toEqual(dummyAccount);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/accounts/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyAccount);
  });

  it('should create a new account', () => {
    const newAccount: Account = {
      id: 3,
      accountNumber: '789012',
      accountType: 'Savings',
      initialBalance: 3000,
      availableBalance: 3000,
      status: true,
      client: dummyClient,
    };

    service.createAccount(newAccount).subscribe((account) => {
      expect(account).toEqual(newAccount);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/accounts`);
    expect(req.request.method).toBe('POST');
    req.flush(newAccount);
  });

  it('should delete an account', () => {
    service.deleteAccount(1).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/accounts/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
