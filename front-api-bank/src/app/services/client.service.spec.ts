import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ClientService } from './client.service';
import { environment } from '../../environments/environment';
import { Client } from '../interface/client.model';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService],
    }).compileComponents();

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all clients', () => {
    const dummyClients: Client[] = [
      {
        id: 1,
        name: 'Client 1',
        gender: 'Male',
        age: 30,
        identification: '123',
        address: 'Address 1',
        phone: '123456',
        clientId: 'client1',
        password: 'password',
        status: true,
      },
      {
        id: 2,
        name: 'Client 2',
        gender: 'Female',
        age: 25,
        identification: '456',
        address: 'Address 2',
        phone: '654321',
        clientId: 'client2',
        password: 'password',
        status: true,
      },
    ];

    service.getAllClients().subscribe((clients) => {
      expect(clients.length).toBe(2);
      expect(clients).toEqual(dummyClients);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clients`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyClients);
  });

  it('should retrieve a client by ID', () => {
    const dummyClient: Client = {
      id: 1,
      name: 'Client 1',
      gender: 'Male',
      age: 30,
      identification: '123',
      address: 'Address 1',
      phone: '123456',
      clientId: 'client1',
      password: 'password',
      status: true,
    };

    service.getClientById(1).subscribe((client) => {
      expect(client).toEqual(dummyClient);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clients/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyClient);
  });

  it('should create a new client', () => {
    const newClient: Client = {
      id: 3,
      name: 'Client 3',
      gender: 'Male',
      age: 35,
      identification: '789',
      address: 'Address 3',
      phone: '987654',
      clientId: 'client3',
      password: 'password',
      status: true,
    };

    service.createClient(newClient).subscribe((client) => {
      expect(client).toEqual(newClient);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clients`);
    expect(req.request.method).toBe('POST');
    req.flush(newClient);
  });

  it('should delete a client', () => {
    service.deleteClient(1).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clients/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
