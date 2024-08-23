-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS bank_db;

-- Usar la base de datos
USE bank_db;

-- Tabla para Persona (heredada por Cliente)
CREATE TABLE person (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    age INT,
    identification VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(255)
);

-- Tabla para Cliente
CREATE TABLE client (
    id BIGINT NOT NULL,
    client_id VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status BOOLEAN,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES person(id)
);

-- Tabla para Cuenta
CREATE TABLE account (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(255) NOT NULL UNIQUE,
    account_type VARCHAR(255) NOT NULL,
    initial_balance DOUBLE NOT NULL,
    status BOOLEAN,
    client_id BIGINT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES client(id)
);

-- Tabla para Movimientos
CREATE TABLE transaction (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    date DATETIME NOT NULL,
    transaction_type VARCHAR(255) NOT NULL,
    amount DOUBLE NOT NULL,
    balance DOUBLE NOT NULL,
    account_id BIGINT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(id)
);
