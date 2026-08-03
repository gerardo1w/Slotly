package com.epiis.reservacanchas.business;

import com.epiis.reservacanchas.dto.request.RequestPitchInsert;
import com.epiis.reservacanchas.dto.request.RequestPitchUpdate;
import com.epiis.reservacanchas.dto.response.ResponsePitchGet;
import com.epiis.reservacanchas.entity.EntityComplex;
import com.epiis.reservacanchas.entity.EntityPitch;
import com.epiis.reservacanchas.repository.RepositoryComplex;
import com.epiis.reservacanchas.repository.RepositoryPitch;
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
class BusinessPitchTest {

    @Mock
    private RepositoryPitch repositoryPitch;

    @Mock
    private RepositoryComplex repositoryComplex;

    @InjectMocks
    private BusinessPitch businessPitch;

    private EntityPitch mockPitch;
    private EntityComplex mockComplex;

    @BeforeEach
    void setUp() {
        mockComplex = new EntityComplex();
        mockComplex.setIdComplex("c-1");
        mockComplex.setPitchesCount(0);

        mockPitch = new EntityPitch();
        mockPitch.setIdPitch("p-1");
        mockPitch.setComplexId("c-1");
        mockPitch.setName("Cancha Sintetica 1");
        mockPitch.setSport("Fútbol");
        mockPitch.setPricePerHour(60.0);
        mockPitch.setActive(true);
    }

    @Test
    void testGetAll_WithComplexId() {
        when(repositoryPitch.findByComplexId("c-1")).thenReturn(Collections.singletonList(mockPitch));

        List<Map<String, Object>> list = businessPitch.getAll("c-1");

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("Cancha Sintetica 1", list.get(0).get("name"));
    }

    @Test
    void testGetAll_NullComplexId() {
        when(repositoryPitch.findAll()).thenReturn(Collections.singletonList(mockPitch));

        List<Map<String, Object>> list = businessPitch.getAll(null);

        assertNotNull(list);
        assertEquals(1, list.size());
    }

    @Test
    void testInsert_Success() {
        RequestPitchInsert request = new RequestPitchInsert();
        request.setComplexId("c-1");
        request.setName("Cancha Sintetica 1");
        request.setSport("Fútbol");
        request.setPricePerHour(60.0);

        when(repositoryComplex.findById("c-1")).thenReturn(Optional.of(mockComplex));

        ResponsePitchGet response = businessPitch.insert(request);

        assertNotNull(response);
        assertEquals("success", response.getType());
        assertEquals("Cancha Sintetica 1", response.getName());
        verify(repositoryPitch, times(1)).save(any(EntityPitch.class));
        verify(repositoryComplex, times(1)).save(any(EntityComplex.class));
    }

    @Test
    void testInsert_ComplexNotFound() {
        RequestPitchInsert request = new RequestPitchInsert();
        request.setComplexId("invalid");

        when(repositoryComplex.findById("invalid")).thenReturn(Optional.empty());

        ResponsePitchGet response = businessPitch.insert(request);

        assertNotNull(response);
        assertEquals("error", response.getType());
        verify(repositoryPitch, never()).save(any(EntityPitch.class));
    }

    @Test
    void testUpdate_Success() {
        RequestPitchUpdate request = new RequestPitchUpdate();
        request.setId("p-1");
        request.setName("Cancha Voley 1");
        request.setSport("Vóley");
        request.setPricePerHour(40.0);

        when(repositoryPitch.findById("p-1")).thenReturn(Optional.of(mockPitch));

        ResponsePitchGet response = businessPitch.update(request);

        assertNotNull(response);
        assertEquals("success", response.getType());
        assertEquals("Cancha Voley 1", response.getName());
        verify(repositoryPitch, times(1)).save(any(EntityPitch.class));
    }

    @Test
    void testUpdate_NotFound() {
        RequestPitchUpdate request = new RequestPitchUpdate();
        request.setId("invalid");

        when(repositoryPitch.findById("invalid")).thenReturn(Optional.empty());

        ResponsePitchGet response = businessPitch.update(request);

        assertNotNull(response);
        assertEquals("error", response.getType());
    }
}