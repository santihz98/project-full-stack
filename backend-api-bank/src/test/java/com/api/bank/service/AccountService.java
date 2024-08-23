package com.api.bank.service;

import com.api.bank.model.Account;
import com.api.bank.model.Client;
import com.api.bank.repository.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AccountServiceTest {

    @InjectMocks
    private AccountService accountService;

    @Mock
    private AccountRepository accountRepository;

    private Account account;
    private Client client;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        client = new Client();
        client.setId(1L);
        client.setClientId("marianela");

        account = new Account();
        account.setId(1L);
        account.setAccountNumber("1234567890");
        account.setAccountType("Savings");
        account.setInitialBalance(1000.0);
        account.setClient(client);
    }

    @Test
    void testGetAccountById() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(account));
        Account foundAccount = accountService.getAccountById(1L);
        assertNotNull(foundAccount);
        assertEquals("1234567890", foundAccount.getAccountNumber());
    }

    @Test
    void testCreateAccount() {
        when(accountRepository.save(account)).thenReturn(account);
        Account savedAccount = accountService.createAccount(account);
        assertNotNull(savedAccount);
        assertEquals("Savings", savedAccount.getAccountType());
        verify(accountRepository, times(1)).save(account);
    }
}
