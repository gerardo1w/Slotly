package com.epiis.reservacanchas.business;

import com.epiis.reservacanchas.dto.request.RequestComplexUpdate;
import com.epiis.reservacanchas.dto.response.ResponseComplexGet;
import com.epiis.reservacanchas.entity.EntityComplex;
import com.epiis.reservacanchas.repository.RepositoryComplex;
import com.epiis.reservacanchas.staticdata.EnumComplexStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BusinessComplexTest {

    @Mock
    private RepositoryComplex repositoryComplex;

    @InjectMocks
    private BusinessComplex businessComplex;

    private EntityComplex mockComplex;

    @BeforeEach
    void setUp() {
        mockComplex = new EntityComplex();
        mockComplex.setIdComplex("c-1");
        mockComplex.setName("Complejo San Martin");
        mockComplex.setAddress("Av. Peru 123");
        mockComplex.setDistrict("Lima");
        mockComplex.setOwnerId("u-1");
        mockComplex.setStatus(EnumComplexStatus.APPROVED);
        mockComplex.setPhone("987654321");
        mockComplex.setActive(true);
    }

    @Test
    void testGetAll_ApprovedOnly_True() {
        when(repositoryComplex.findByStatus(EnumComplexStatus.APPROVED)).thenReturn(Collections.singletonList(mockComplex));

        List<Map<String, Object>> result = businessComplex.getAll(true);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Complejo San Martin", result.get(0).get("name"));
    }

    @Test
    void testGetAll_ApprovedOnly_False() {
        when(repositoryComplex.findAll()).thenReturn(Collections.singletonList(mockComplex));

        List<Map<String, Object>> result = businessComplex.getAll(false);

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void testApprove_Success() {
        mockComplex.setStatus(EnumComplexStatus.PENDING);
        when(repositoryComplex.findById("c-1")).thenReturn(Optional.of(mockComplex));

        ResponseComplexGet response = businessComplex.approve("c-1");

        assertNotNull(response);
        assertEquals("success", response.getType());
        assertEquals("approved", response.getStatus());
        verify(repositoryComplex, times(1)).save(any(EntityComplex.class));
    }

    @Test
    void testApprove_NotFound() {
        when(repositoryComplex.findById("invalid")).thenReturn(Optional.empty());

        ResponseComplexGet response = businessComplex.approve("invalid");

        assertNotNull(response);
        assertEquals("error", response.getType());
    }

    @Test
    void testUpdate_Success() {
        RequestComplexUpdate request = new RequestComplexUpdate();
        request.setId("c-1");
        request.setName("Complejo Actualizado");
        request.setAddress("Av. Brasil 456");
        request.setDistrict("San Isidro");
        request.setPhone("999888777");
        request.setImage("img.png");

        when(repositoryComplex.findById("c-1")).thenReturn(Optional.of(mockComplex));

        ResponseComplexGet response = businessComplex.update(request);

        assertNotNull(response);
        assertEquals("success", response.getType());
        assertEquals("Complejo Actualizado", response.getName());
        verify(repositoryComplex, times(1)).save(any(EntityComplex.class));
    }

    @Test
    void testUpdate_NotFound() {
        RequestComplexUpdate request = new RequestComplexUpdate();
        request.setId("invalid");

        when(repositoryComplex.findById("invalid")).thenReturn(Optional.empty());

        ResponseComplexGet response = businessComplex.update(request);

        assertNotNull(response);
        assertEquals("error", response.getType());
    }
}