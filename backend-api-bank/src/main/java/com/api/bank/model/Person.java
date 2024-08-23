package com.api.bank.model;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@MappedSuperclass
public abstract class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Gender cannot be blank")
    private String gender;

    private int age;

    @NotBlank(message = "Identification cannot be blank")
    @Size(min = 6, message = "Identification must be at least 6 characters long")
    private String identification;

    private String address;
    private String phone;
}
