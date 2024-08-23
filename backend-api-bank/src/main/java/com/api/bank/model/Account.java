package com.api.bank.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
@Entity
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Account number cannot be blank")
    @Column(unique = true)
    private String accountNumber;

    @NotBlank(message = "Account type cannot be blank")
    private String accountType;

    @Positive(message = "Initial balance must be positive")
    private double initialBalance;

    private boolean status;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
}
