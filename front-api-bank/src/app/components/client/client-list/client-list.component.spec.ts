import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientListComponent } from './client-list.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Client } from '../../../interface/client.model';

describe('ClientListComponent', () => {
  let component: ClientListComponent;
  let fixture: ComponentFixture<ClientListComponent>;
  let clientService: jest.Mocked<ClientService>;

  beforeEach(async () => {
    const clientServiceMock = {
      createClient: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: ClientService, useValue: clientServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
    clientService = TestBed.inject(ClientService) as jest.Mocked<ClientService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the form if valid', () => {
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

    clientService.createClient.mockReturnValue(of(dummyClient));

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.clientForm.setValue({
      name: 'Client 1',
      gender: 'Male',
      age: 30,
      identification: '123456789',
      address: 'Address 1',
      phone: '555-5555',
      clientId: 'client1',
      password: 'password',
      status: true,
    });

    const clientCreatedSpy = jest.spyOn(component.clientCreated, 'emit');
    const closeModalSpy = jest.spyOn(component.closeModal, 'emit');

    component.onSubmit();

    expect(clientService.createClient).toHaveBeenCalledWith(
      component.clientForm.value
    );
    expect(alertSpy).toHaveBeenCalledWith('Cliente creado exitosamente');
    expect(clientCreatedSpy).toHaveBeenCalled();
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should show an error alert if form submission fails', () => {
    clientService.createClient.mockReturnValue(
      throwError(() => new Error('Error creating client'))
    );

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.clientForm.setValue({
      name: 'Client 1',
      gender: 'Male',
      age: 30,
      identification: '123456789',
      address: 'Address 1',
      phone: '555-5555',
      clientId: 'client1',
      password: 'password',
      status: true,
    });

    component.onSubmit();

    expect(clientService.createClient).toHaveBeenCalledWith(
      component.clientForm.value
    );
    expect(alertSpy).toHaveBeenCalledWith('Hubo un error al crear el cliente');
  });

  it('should not submit the form if invalid', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.clientForm.setValue({
      name: '',
      gender: 'Male',
      age: 0,
      identification: '123',
      address: '',
      phone: '',
      clientId: '',
      password: '',
      status: true,
    });

    component.onSubmit();

    expect(clientService.createClient).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('should emit closeModal event when onCancel is called', () => {
    const closeModalSpy = jest.spyOn(component.closeModal, 'emit');

    component.onCancel();

    expect(closeModalSpy).toHaveBeenCalled();
  });
});
