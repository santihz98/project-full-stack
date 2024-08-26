import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../interface/client.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css',
})
export class ClientListComponent {
  clientForm: FormGroup;

  @Output() closeModal = new EventEmitter<void>();
  @Output() clientCreated = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private clientService: ClientService) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      identification: ['', [Validators.required, Validators.minLength(6)]],
      address: [''],
      phone: [''],
      clientId: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', Validators.required],
      status: [true],
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.clientService.createClient(this.clientForm.value).subscribe({
        next: (response: Client) => {
          alert('Cliente creado exitosamente');
          this.clientForm.reset();
          this.clientCreated.emit();
          this.closeModal.emit();
        },
        error: (error: any) => {
          alert('Hubo un error al crear el cliente');
        },
      });
    }
  }

  onCancel() {
    this.closeModal.emit();
  }
}
