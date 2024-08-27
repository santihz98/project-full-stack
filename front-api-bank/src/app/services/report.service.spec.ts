import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReportService } from './report.service';
import { environment } from '../../environments/environment';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportService],
    });

    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve the report in JSON format', () => {
    const dummyReport = 'Account Statement Report...';

    service
      .getReport(1, '2024-08-01T00:00:00', '2024-08-31T23:59:59', 'json')
      .subscribe((report) => {
        expect(report).toEqual(dummyReport);
      });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/reports?clientId=1&startDate=2024-08-01T00:00:00&endDate=2024-08-31T23:59:59&format=json`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyReport);
  });

  it('should retrieve the report in PDF format', () => {
    const dummyPdfBase64 = 'JVBERi0xLjcKJeLjz9MK...'; // base64 string

    service
      .getReport(1, '2024-08-01T00:00:00', '2024-08-31T23:59:59', 'pdf')
      .subscribe((pdfData) => {
        expect(pdfData).toEqual(dummyPdfBase64);
      });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/reports?clientId=1&startDate=2024-08-01T00:00:00&endDate=2024-08-31T23:59:59&format=pdf`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyPdfBase64);
  });
});
