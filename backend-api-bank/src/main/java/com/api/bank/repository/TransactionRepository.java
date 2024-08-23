package com.api.bank.repository;

import com.api.bank.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccount_IdAndDateBetween(Long accountId, LocalDateTime startDate, LocalDateTime endDate);
}
