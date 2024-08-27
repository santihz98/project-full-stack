import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../interface/client.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export default class ReportComponent implements OnInit {
  reportForm: FormGroup;
  clients: Client[] = [];
  reportContent: string | null = null;
  pdfBase64: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private clientService: ClientService
  ) {
    this.reportForm = this.fb.group({
      clientId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
      },
      error: (err) => {
        console.error('Error loading clients:', err);
      },
    });
  }

  generateReport(): void {
    if (this.reportForm.valid) {
      const { clientId, startDate, endDate } = this.reportForm.value;

      const formattedStartDate = this.formatDate(startDate);
      const formattedEndDate = this.formatDate(endDate);

      this.reportService
        .getReport(clientId, formattedStartDate, formattedEndDate, 'json')
        .subscribe({
          next: (data) => {
            this.reportContent = data;
          },
          error: (err) => {
            console.error('Error generating report:', err);
          },
        });
    }
  }

  downloadPdf(): void {
    if (this.reportForm.valid) {
      const { clientId, startDate, endDate } = this.reportForm.value;

      const formattedStartDate = this.formatDate(startDate);
      const formattedEndDate = this.formatDate(endDate);

      this.reportService
        .getReport(clientId, formattedStartDate, formattedEndDate, 'pdf')
        .subscribe({
          next: (pdfData) => {
            this.pdfBase64 = pdfData;
            const linkSource = `data:application/pdf;base64,${pdfData}`;
            const downloadLink = document.createElement('a');
            const fileName = 'AccountStatement.pdf';

            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          },
          error: (err) => {
            console.error('Error downloading PDF:', err);
          },
        });
    }
  }

  private formatDate(date: string): string {
    const formattedDate = new Date(date).toISOString().split('.')[0];
    return formattedDate;
  }
}
