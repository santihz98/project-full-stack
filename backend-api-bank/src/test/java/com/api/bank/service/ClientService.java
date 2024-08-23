package com.api.bank.service;

import com.api.bank.model.Client;
import com.api.bank.repository.ClientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ClientServiceTest {

    @InjectMocks
    private ClientService clientService;

    @Mock
    private ClientRepository clientRepository;

    private Client client;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        client = new Client();
        client.setClientId("marianela");
        client.setName("Marianela Montalvo");
        client.setPassword("password");
    }

    @Test
    void testGetClientById() {
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        Client foundClient = clientService.getClientById(1L);
        assertNotNull(foundClient);
        assertEquals("marianela", foundClient.getClientId());
    }

    @Test
    void testCreateClientWhenClientIdAlreadyExists() {
        when(clientRepository.findByClientId("marianela")).thenReturn(Optional.of(client));
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            clientService.createClient(client);
        });
        assertEquals("Already registered user", exception.getMessage());
    }

    @Test
    void testCreateClientSuccessfully() {
        when(clientRepository.findByClientId("marianela")).thenReturn(Optional.empty());
        when(clientRepository.save(client)).thenReturn(client);

        Client savedClient = clientService.createClient(client);
        assertNotNull(savedClient);
        assertEquals("Marianela Montalvo", savedClient.getName());
        verify(clientRepository, times(1)).save(client);
    }
}
