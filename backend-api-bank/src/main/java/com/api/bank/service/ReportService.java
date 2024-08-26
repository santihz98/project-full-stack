package com.api.bank.service;

import com.api.bank.exception.ResourceNotFoundException;
import com.api.bank.model.Account;
import com.api.bank.model.Client;
import com.api.bank.model.Transaction;
import com.api.bank.repository.AccountRepository;
import com.api.bank.repository.ClientRepository;
import com.api.bank.repository.TransactionRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public String generateReport(Long clientId, LocalDateTime startDate, LocalDateTime endDate, String format) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con el id: " + clientId));

        List<Account> accounts = accountRepository.findByClient_Id(clientId);
        StringBuilder reportContent = new StringBuilder();

        reportContent.append("Reporte de Estado de Cuenta\n");
        reportContent.append("Cliente: ").append(client.getName()).append("\n");
        reportContent.append("Fecha de Reporte: ").append(LocalDateTime.now()).append("\n\n");

        for (Account account : accounts) {
            reportContent.append("Cuenta: ").append(account.getAccountNumber()).append("\n");
            reportContent.append("Saldo Inicial: ").append(account.getInitialBalance()).append("\n");

            List<Transaction> transactions = transactionRepository.findByAccount_IdAndDateBetween(
                    account.getId(), startDate, endDate);

            double totalCredits = transactions.stream()
                    .filter(t -> "CREDIT".equalsIgnoreCase(t.getTransactionType()))
                    .mapToDouble(Transaction::getAmount)
                    .sum();

            double totalDebits = transactions.stream()
                    .filter(t -> "DEBIT".equalsIgnoreCase(t.getTransactionType()))
                    .mapToDouble(Transaction::getAmount)
                    .sum();

            reportContent.append("Total Créditos: ").append(totalCredits).append("\n");
            reportContent.append("Total Débitos: ").append(totalDebits).append("\n");
            reportContent.append("Saldo Final: ").append(account.getAvailableBalance()).append("\n\n");
        }

        if ("pdf".equalsIgnoreCase(format)) {
            return generatePdfReport(reportContent.toString());
        } else {
            return reportContent.toString();
        }
    }

    private String generatePdfReport(String reportContent) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);
            document.open();
            document.add(new Paragraph(reportContent));
            document.close();
            return Base64.getEncoder().encodeToString(outputStream.toByteArray());
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Error al generar el PDF", e);
        }
    }
}
