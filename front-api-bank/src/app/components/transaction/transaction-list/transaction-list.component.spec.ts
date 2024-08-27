import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionListComponent } from './transaction-list.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Client } from '../../../interface/client.model';
import { Account } from '../../../interface/account.model';
import { Transaction } from '../../../interface/transaction.model';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let clientService: jest.Mocked<ClientService>;
  let accountService: jest.Mocked<AccountService>;
  let transactionService: jest.Mocked<TransactionService>;

  beforeEach(async () => {
    const clientServiceMock = {
      getAllClients: jest.fn(),
    };

    const accountServiceMock = {
      getAllAccounts: jest.fn(),
    };

    const transactionServiceMock = {
      createTransaction: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: ClientService, useValue: clientServiceMock },
        { provide: AccountService, useValue: accountServiceMock },
        { provide: TransactionService, useValue: transactionServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
    clientService = TestBed.inject(ClientService) as jest.Mocked<ClientService>;
    accountService = TestBed.inject(
      AccountService
    ) as jest.Mocked<AccountService>;
    transactionService = TestBed.inject(
      TransactionService
    ) as jest.Mocked<TransactionService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clients and accounts on initialization', () => {
    const dummyClients: Client[] = [
      {
        id: 1,
        name: 'Client 1',
        gender: 'Male',
        age: 30,
        identification: '123',
        address: 'Address 1',
        phone: '555-5555',
        clientId: 'client1',
        password: 'password',
        status: true,
      },
    ];
    const dummyAccounts: Account[] = [
      {
        id: 1,
        accountNumber: '123456',
        accountType: 'Checking',
        initialBalance: 1000,
        availableBalance: 1000,
        status: true,
        client: dummyClients[0],
      },
    ];

    clientService.getAllClients.mockReturnValue(of(dummyClients));
    accountService.getAllAccounts.mockReturnValue(of(dummyAccounts));

    component.ngOnInit();

    expect(clientService.getAllClients).toHaveBeenCalled();
    expect(accountService.getAllAccounts).toHaveBeenCalled();
    expect(component.clients).toEqual(dummyClients);
    expect(component.accounts).toEqual(dummyAccounts);
  });

  it('should filter accounts based on selected client', () => {
    const dummyClients: Client[] = [
      {
        id: 1,
        name: 'Client 1',
        gender: 'Male',
        age: 30,
        identification: '123',
        address: 'Address 1',
        phone: '555-5555',
        clientId: 'client1',
        password: 'password',
        status: true,
      },
    ];
    const dummyAccounts: Account[] = [
      {
        id: 1,
        accountNumber: '123456',
        accountType: 'Checking',
        initialBalance: 1000,
        availableBalance: 1000,
        status: true,
        client: dummyClients[0],
      },
      {
        id: 2,
        accountNumber: '654321',
        accountType: 'Savings',
        initialBalance: 2000,
        availableBalance: 2000,
        status: true,
        client: dummyClients[0],
      },
    ];

    component.clients = dummyClients;
    component.accounts = dummyAccounts;

    const event = { target: { value: '1' } };
    component.onClientChange(event);

    expect(component.filteredAccounts).toEqual(dummyAccounts);
  });

  it('should create a new transaction if form is valid', () => {
    const dummyTransaction: Transaction = {
      id: 1,
      accountId: { id: 1 },
      date: '2024-08-26T20:10:00',
      transactionType: 'CREDIT',
      amount: 200,
      balance: 1200,
      account: {
        id: 1,
        accountNumber: '123456',
        accountType: 'Checking',
        initialBalance: 1000,
        availableBalance: 1200,
        status: true,
        client: {
          id: 1,
          name: 'Client 1',
          gender: 'Male',
          age: 30,
          identification: '123',
          address: 'Address 1',
          phone: '555-5555',
          clientId: 'client1',
          password: 'password',
          status: true,
        },
      },
      client: {
        id: 1,
        name: 'Client 1',
        gender: 'Male',
        age: 30,
        identification: '123',
        address: 'Address 1',
        phone: '555-5555',
        clientId: 'client1',
        password: 'password',
        status: true,
      },
    };

    transactionService.createTransaction.mockReturnValue(of(dummyTransaction));

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const transactionCreatedSpy = jest.spyOn(
      component.transactionCreated,
      'emit'
    );
    const closeModalSpy = jest.spyOn(component.closeModal, 'emit');

    component.transactionForm.setValue({
      clientId: '1',
      accountId: '1',
      transactionType: 'CREDIT',
      amount: 200,
      date: '2024-08-26T20:10:00',
    });

    component.onSubmit();

    expect(transactionService.createTransaction).toHaveBeenCalledWith({
      account: { id: 1 },
      transactionType: 'CREDIT',
      amount: 200,
      date: '2024-08-26T20:10:00',
    });
    expect(alertSpy).toHaveBeenCalledWith('Transacción creada exitosamente');
    expect(transactionCreatedSpy).toHaveBeenCalled();
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should show an error alert if form submission fails', () => {
    transactionService.createTransaction.mockReturnValue(
      throwError(() => new Error('Error creating transaction'))
    );

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.transactionForm.setValue({
      clientId: '1',
      accountId: '1',
      transactionType: 'CREDIT',
      amount: 200,
      date: '2024-08-26T20:10:00',
    });

    component.onSubmit();

    expect(transactionService.createTransaction).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      'Hubo un error al crear la transacción'
    );
  });

  it('should emit closeModal event when onCancel is called', () => {
    const closeModalSpy = jest.spyOn(component.closeModal, 'emit');

    component.onCancel();

    expect(closeModalSpy).toHaveBeenCalled();
  });
});
