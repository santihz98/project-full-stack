package com.api.bank.service;

import com.api.bank.model.Account;
import com.api.bank.model.Transaction;
import com.api.bank.repository.AccountRepository;
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

    @Mock
    private AccountRepository accountRepository;

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
        when(accountRepository.save(any(Account.class))).thenReturn(account);
        when(transactionRepository.save(transaction)).thenReturn(transaction);

        Transaction savedTransaction = transactionService.createTransaction(transaction);

        assertNotNull(savedTransaction);
        assertEquals(1200.0, savedTransaction.getBalance()); // saldo actualizado después del crédito
        verify(transactionRepository, times(1)).save(transaction);
    }
}
