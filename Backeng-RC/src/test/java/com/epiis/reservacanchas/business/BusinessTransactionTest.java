package com.epiis.reservacanchas.business;

import com.epiis.reservacanchas.dto.request.RequestTransactionInsert;
import com.epiis.reservacanchas.dto.response.ResponseTransactionGet;
import com.epiis.reservacanchas.entity.EntityTransaction;
import com.epiis.reservacanchas.repository.RepositoryTransaction;
import com.epiis.reservacanchas.staticdata.EnumTransactionType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BusinessTransactionTest {

    @Mock
    private RepositoryTransaction repositoryTransaction;

    @InjectMocks
    private BusinessTransaction businessTransaction;

    private EntityTransaction mockTransaction;

    @BeforeEach
    void setUp() {
        mockTransaction = new EntityTransaction();
        mockTransaction.setIdTransaction("t-1");
        mockTransaction.setComplexId("c-1");
        mockTransaction.setType(EnumTransactionType.INCOME);
        mockTransaction.setDescription("Pago reserva");
        mockTransaction.setAmount(50.0);
        mockTransaction.setDate("2026-08-10");
    }

    @Test
    void testGetAll() {
        when(repositoryTransaction.findByComplexId("c-1")).thenReturn(Collections.singletonList(mockTransaction));

        List<Map<String, Object>> list = businessTransaction.getAll("c-1");

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("income", list.get(0).get("type"));
    }

    @Test
    void testInsert_Success() {
        RequestTransactionInsert request = new RequestTransactionInsert();
        request.setComplexId("c-1");
        request.setType("income");
        request.setDescription("Pago reserva");
        request.setAmount(50.0);
        request.setDate("2026-08-10");

        ResponseTransactionGet response = businessTransaction.insert(request);

        assertNotNull(response);
        assertEquals("income", response.getType());
        assertEquals(50.0, response.getAmount());
        verify(repositoryTransaction, times(1)).save(any(EntityTransaction.class));
    }
}