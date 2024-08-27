import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountListComponent } from './account-list.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { AccountService } from '../../../services/account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Client } from '../../../interface/client.model';
import { Account } from '../../../interface/account.model';
import { By } from '@angular/platform-browser';

describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;
  let clientService: jest.Mocked<ClientService>;
  let accountService: jest.Mocked<AccountService>;

  beforeEach(async () => {
    const clientServiceMock = {
      getAllClients: jest.fn(),
    };

    const accountServiceMock = {
      createAccount: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: ClientService, useValue: clientServiceMock },
        { provide: AccountService, useValue: accountServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountListComponent);
    component = fixture.componentInstance;
    clientService = TestBed.inject(ClientService) as jest.Mocked<ClientService>;
    accountService = TestBed.inject(
      AccountService
    ) as jest.Mocked<AccountService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clients on initialization', () => {
    const dummyClients: Client[] = [
      {
        id: 1,
        name: 'Client 1',
        gender: 'Male',
        age: 30,
        identification: '123456',
        address: 'Address 1',
        phone: '555-5555',
        clientId: 'client1',
        password: 'password',
        status: true,
      },
    ];

    clientService.getAllClients.mockReturnValue(of(dummyClients));

    component.ngOnInit();

    expect(clientService.getAllClients).toHaveBeenCalled();
    expect(component.clients).toEqual(dummyClients);
  });

  it('should create a new account when form is valid', () => {
    const dummyAccount: Account = {
      accountNumber: '123456',
      accountType: 'Checking',
      initialBalance: 1000,
      status: true,
      client: { id: 1 } as Client,
    };

    accountService.createAccount.mockReturnValue(of(dummyAccount));

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const accountCreatedSpy = jest.spyOn(component.accountCreated, 'emit');

    component.accountForm.setValue({
      clientId: '1',
      accountNumber: '123456',
      accountType: 'Checking',
      initialBalance: 1000,
      status: true,
    });

    component.createAccount();

    expect(accountService.createAccount).toHaveBeenCalledWith(dummyAccount);
    expect(accountCreatedSpy).toHaveBeenCalled();
  });

  it('should handle account creation error', () => {
    accountService.createAccount.mockReturnValue(
      throwError(() => new Error('Error creating account'))
    );

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    component.accountForm.setValue({
      clientId: '1',
      accountNumber: '123456',
      accountType: 'Checking',
      initialBalance: 1000,
      status: true,
    });

    component.createAccount();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error creating account:',
      expect.any(Error)
    );
  });

  it('should emit cancel event when cancelModal is called', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');

    component.cancelModal();

    expect(cancelSpy).toHaveBeenCalled();
  });
});
