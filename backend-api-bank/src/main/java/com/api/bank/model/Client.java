package com.api.bank.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
public class Client extends Person {

    @NotBlank(message = "Client ID cannot be blank")
    @Size(min = 5, message = "Client ID must be at least 5 characters long")
    @Column(unique = true)
    private String clientId;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    private boolean status;
}