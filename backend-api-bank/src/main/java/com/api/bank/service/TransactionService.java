package com.api.bank.service;

import com.api.bank.exception.ResourceNotFoundException;
import com.api.bank.model.Account;
import com.api.bank.model.Transaction;
import com.api.bank.repository.AccountRepository;
import com.api.bank.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
    }

    public Transaction createTransaction(Transaction transaction) {
        validateAndProcessTransaction(transaction);
        return transactionRepository.save(transaction);
    }

    private void validateAndProcessTransaction(Transaction transaction) {
        Account account = transaction.getAccount();

        // Obtener el total de débitos del día para validar el límite diario
        double dailyDebitTotal = transactionRepository.findByAccount_IdAndDateBetween(
                        account.getId(),
                        LocalDateTime.now().toLocalDate().atStartOfDay(),
                        LocalDateTime.now()
                ).stream()
                .filter(t -> "DEBIT".equalsIgnoreCase(t.getTransactionType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        // Validar tipo de transacción
        if ("CREDIT".equalsIgnoreCase(transaction.getTransactionType())) {
            if (transaction.getAmount() <= 0) {
                throw new IllegalArgumentException("El monto del crédito debe ser positivo");
            }
            account.setInitialBalance(account.getInitialBalance() + transaction.getAmount());
        } else if ("DEBIT".equalsIgnoreCase(transaction.getTransactionType())) {
            if (transaction.getAmount() > 0) {
                transaction.setAmount(-transaction.getAmount());
            }

            // Verificar si se ha excedido el límite diario de retiro antes de validar el saldo
            if (dailyDebitTotal + Math.abs(transaction.getAmount()) > 1000) {
                throw new IllegalArgumentException("Cupo diario Excedido");
            }

            // Verificar si hay saldo suficiente para realizar el débito
            if (account.getInitialBalance() + transaction.getAmount() < 0) {
                throw new IllegalArgumentException("Saldo no disponible");
            }

            account.setInitialBalance(account.getInitialBalance() + transaction.getAmount());
        } else {
            throw new IllegalArgumentException("Tipo de transacción no soportado");
        }

        // Establecer el saldo actualizado en la transacción
        transaction.setBalance(account.getInitialBalance());

        // Guardar la cuenta actualizada
        accountRepository.save(account);
    }

    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Transaction not found with id: " + id);
        }
        transactionRepository.deleteById(id);
    }

    public List<Transaction> getTransactionsByDateRange(Long accountId, LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByAccount_IdAndDateBetween(accountId, startDate, endDate);
    }
}
