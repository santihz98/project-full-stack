package com.api.bank.service;

import com.api.bank.exception.ResourceNotFoundException;
import com.api.bank.model.Account;
import com.api.bank.repository.AccountRepository;
import com.api.bank.model.Client;
import com.api.bank.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ClientRepository clientRepository;

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
    }

    public Account createAccount(Account account) {
        if (account.getClient() == null) {
            throw new IllegalArgumentException("El cliente no puede estar vacío");
        }
        // Verifica que el cliente existe en la base de datos
        Client client = clientRepository.findById(account.getClient().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
        account.setClient(client);
        account.setAvailableBalance(account.getInitialBalance());
        return accountRepository.save(account);
    }

    public void deleteAccount(Long id) {
        if (!accountRepository.existsById(id)) {
            throw new ResourceNotFoundException("Account not found with id: " + id);
        }
        accountRepository.deleteById(id);
    }
}
