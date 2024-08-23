package com.api.bank.service;

import com.api.bank.exception.ResourceNotFoundException;
import com.api.bank.model.Account;
import com.api.bank.model.Transaction;
import com.api.bank.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
    }

    public Transaction createTransaction(Transaction transaction) {
        validateTransaction(transaction);
        return transactionRepository.save(transaction);
    }

    private void validateTransaction(Transaction transaction) {
        Account account = transaction.getAccount();

        double dailyDebitTotal = transactionRepository.findByAccount_IdAndDateBetween(
                        account.getId(),
                        LocalDateTime.now().toLocalDate().atStartOfDay(),
                        LocalDateTime.now()
                ).stream()
                .filter(t -> "DEBIT".equalsIgnoreCase(t.getTransactionType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        if (transaction.getAmount() < 0) {
            if (dailyDebitTotal + Math.abs(transaction.getAmount()) > 1000) {
                throw new IllegalArgumentException("Daily quota exceeded");
            }
            if (account.getInitialBalance() + transaction.getAmount() < 0) {
                throw new IllegalArgumentException("Balance not available");
            }
        }

        transaction.setBalance(account.getInitialBalance() + transaction.getAmount());
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
