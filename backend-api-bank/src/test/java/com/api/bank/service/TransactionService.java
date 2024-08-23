package com.api.bank.service;

import com.api.bank.model.Account;
import com.api.bank.model.Transaction;
import com.api.bank.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TransactionServiceTest {

    @InjectMocks
    private TransactionService transactionService;

    @Mock
    private TransactionRepository transactionRepository;

    private Transaction transaction;
    private Account account;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        account = new Account();
        account.setId(1L);
        account.setInitialBalance(1000.0);

        transaction = new Transaction();
        transaction.setId(1L);
        transaction.setAccount(account);
        transaction.setAmount(200.0);
        transaction.setDate(LocalDateTime.now());
        transaction.setTransactionType("CREDIT");
    }

    @Test
    void testGetTransactionById() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));
        Transaction foundTransaction = transactionService.getTransactionById(1L);
        assertNotNull(foundTransaction);
        assertEquals(200.0, foundTransaction.getAmount());
    }

    @Test
    void testCreateTransaction() {
        when(transactionRepository.save(transaction)).thenReturn(transaction);
        Transaction savedTransaction = transactionService.createTransaction(transaction);
        assertNotNull(savedTransaction);
        assertEquals(200.0, savedTransaction.getAmount());
        verify(transactionRepository, times(1)).save(transaction);
    }

    @Test
    void testValidateTransactionWithExceededDailyLimit() {
        Account account = new Account();
        account.setId(1L);
        account.setInitialBalance(1000.0);

        Transaction debitTransaction = new Transaction();
        debitTransaction.setTransactionType("DEBIT");
        debitTransaction.setAmount(-1500.0);
        debitTransaction.setAccount(account);

        List<Transaction> dailyTransactions = Arrays.asList(transaction);
        when(transactionRepository.findByAccount_IdAndDateBetween(
                eq(account.getId()), any(LocalDateTime.class), any(LocalDateTime.class))
        ).thenReturn(dailyTransactions);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            transactionService.createTransaction(debitTransaction);
        });
        assertEquals("Daily quota exceeded", exception.getMessage());
    }
}