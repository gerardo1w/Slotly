package com.epiis.reservacanchas.business;

import com.epiis.reservacanchas.dto.request.RequestClosureInsert;
import com.epiis.reservacanchas.dto.response.ResponseClosureGet;
import com.epiis.reservacanchas.entity.EntityClosure;
import com.epiis.reservacanchas.entity.EntityTransaction;
import com.epiis.reservacanchas.repository.RepositoryClosure;
import com.epiis.reservacanchas.repository.RepositoryTransaction;
import com.epiis.reservacanchas.staticdata.EnumTransactionType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BusinessClosureTest {

    @Mock
    private RepositoryClosure repositoryClosure;

    @Mock
    private RepositoryTransaction repositoryTransaction;

    @InjectMocks
    private BusinessClosure businessClosure;

    private EntityClosure mockClosure;
    private EntityTransaction incomeTrans;
    private EntityTransaction expenseTrans;

    @BeforeEach
    void setUp() {
        mockClosure = new EntityClosure();
        mockClosure.setIdClosure("cl-1");
        mockClosure.setComplexId("c-1");
        mockClosure.setDate("2026-08-10");
        mockClosure.setTotalIncomes(100.0);
        mockClosure.setTotalExpenses(30.0);
        mockClosure.setFinalBalance(70.0);
        mockClosure.setClosedBy("Juan Dueño");

        incomeTrans = new EntityTransaction();
        incomeTrans.setType(EnumTransactionType.INCOME);
        incomeTrans.setAmount(100.0);

        expenseTrans = new EntityTransaction();
        expenseTrans.setType(EnumTransactionType.EXPENSE);
        expenseTrans.setAmount(30.0);
    }

    @Test
    void testGetAll() {
        when(repositoryClosure.findByComplexId("c-1")).thenReturn(Collections.singletonList(mockClosure));

        List<Map<String, Object>> list = businessClosure.getAll("c-1");

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals(70.0, list.get(0).get("finalBalance"));
    }

    @Test
    void testInsert_Success() {
        RequestClosureInsert request = new RequestClosureInsert();
        request.setComplexId("c-1");
        request.setClosedBy("Juan Dueño");

        when(repositoryTransaction.findByComplexId("c-1")).thenReturn(Arrays.asList(incomeTrans, expenseTrans));

        ResponseClosureGet response = businessClosure.insert(request);

        assertNotNull(response);
        assertEquals("success", response.getType());
        assertEquals(100.0, response.getTotalIncomes());
        assertEquals(30.0, response.getTotalExpenses());
        assertEquals(70.0, response.getFinalBalance());
        verify(repositoryClosure, times(1)).save(any(EntityClosure.class));
    }
}