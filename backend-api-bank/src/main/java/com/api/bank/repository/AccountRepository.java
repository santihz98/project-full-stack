package com.api.bank.repository;

import com.api.bank.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByAccountNumber(String accountNumber);

    List<Account> findByClient_Id(Long clientId);
}
