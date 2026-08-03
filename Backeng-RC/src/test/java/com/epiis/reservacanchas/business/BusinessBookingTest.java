package com.epiis.reservacanchas.business;

import com.epiis.reservacanchas.dto.request.RequestBookingCancel;
import com.epiis.reservacanchas.dto.request.RequestBookingInsert;
import com.epiis.reservacanchas.dto.response.ResponseBookingGet;
import com.epiis.reservacanchas.entity.EntityBooking;
import com.epiis.reservacanchas.entity.EntityTransaction;
import com.epiis.reservacanchas.repository.RepositoryBooking;
import com.epiis.reservacanchas.repository.RepositoryTransaction;
import com.epiis.reservacanchas.staticdata.EnumBookingStatus;
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
class BusinessBookingTest {

    @Mock
    private RepositoryBooking repositoryBooking;

    @Mock
    private RepositoryTransaction repositoryTransaction;

    @InjectMocks
    private BusinessBooking businessBooking;

    private EntityBooking mockBooking;

    @BeforeEach
    void setUp() {
        mockBooking = new EntityBooking();
        mockBooking.setIdBooking("b-123");
        mockBooking.setPitchId("p-1");
        mockBooking.setComplexId("c-1");
        mockBooking.setComplexName("Complejo Test");
        mockBooking.setPitchName("Cancha 1");
        mockBooking.setSport("Fútbol");
        mockBooking.setClientName("Juan Perez");
        mockBooking.setClientEmail("juan@gmail.com");
        mockBooking.setDate("2026-08-10");
        mockBooking.setTimeSlot("16:00 - 17:00");
        mockBooking.setPrice(50.0);
        mockBooking.setStatus(EnumBookingStatus.ACTIVE);
        mockBooking.setPaymentMethod("Efectivo");
    }

    @Test
    void testGetAll_All_ReturnsList() {
        when(repositoryBooking.findAll()).thenReturn(Collections.singletonList(mockBooking));

        List<Map<String, Object>> list = businessBooking.getAll(null, null);

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("b-123", list.get(0).get("id"));
        assertEquals("Juan Perez", list.get(0).get("clientName"));
    }

    @Test
    void testGetAll_ByClientEmail_ReturnsList() {
        when(repositoryBooking.findByClientEmail("juan@gmail.com")).thenReturn(Collections.singletonList(mockBooking));

        List<Map<String, Object>> list = businessBooking.getAll("juan@gmail.com", null);

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("juan@gmail.com", list.get(0).get("clientEmail"));
    }

    @Test
    void testGetAll_ByComplexId_ReturnsList() {
        when(repositoryBooking.findByComplexId("c-1")).thenReturn(Collections.singletonList(mockBooking));

        List<Map<String, Object>> list = businessBooking.getAll(null, "c-1");

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("c-1", list.get(0).get("complexId"));
    }

    @Test
    void testInsert_Success_ActiveBooking() {
        RequestBookingInsert request = new RequestBookingInsert();
        request.setPitchId("p-1");
        request.setComplexId("c-1");
        request.setComplexName("Complejo Test");
        request.setPitchName("Cancha 1");
        request.setSport("Fútbol");
        request.setClientName("Juan Perez");
        request.setClientEmail("juan@gmail.com");
        request.setDate("2026-08-10");
        request.setTimeSlot("16:00 - 17:00");
        request.setPrice(50.0);
        request.setStatus("active");
        request.setPaymentMethod("Efectivo");

        when(repositoryBooking.existsByPitchIdAndDateAndTimeSlotAndStatus("p-1", "2026-08-10", "16:00 - 17:00", EnumBookingStatus.ACTIVE))
                .thenReturn(false);

        ResponseBookingGet response = businessBooking.insert(request);

        assertNotNull(response);
        assertEquals("success", response.getType());
        assertEquals("active", response.getStatus());
        verify(repositoryBooking, times(1)).save(any(EntityBooking.class));
        verify(repositoryTransaction, times(1)).save(any(EntityTransaction.class));
    }

    @Test
    void testInsert_Conflict_ActiveBookingAlreadyOccupied() {
        RequestBookingInsert request = new RequestBookingInsert();
        request.setPitchId("p-1");
        request.setDate("2026-08-10");
        request.setTimeSlot("16:00 - 17:00");
        request.setStatus("active");

        when(repositoryBooking.existsByPitchIdAndDateAndTimeSlotAndStatus("p-1", "2026-08-10", "16:00 - 17:00", EnumBookingStatus.ACTIVE))
                .thenReturn(true);

        ResponseBookingGet response = businessBooking.insert(request);

        assertNotNull(response);
        assertEquals("error", response.getType());
        assertTrue(response.getListMessage().get(0).contains("ocupado"));
        verify(repositoryBooking, never()).save(any(EntityBooking.class));
    }

    @Test
    void testInsert_Success_ReservedBooking() {
        RequestBookingInsert request = new RequestBookingInsert();
        request.setPitchId("p-1");
        request.setComplexId("c-1");
        request.setComplexName("Complejo Test");
        request.setPitchName("Cancha 1");
        request.setSport("Fútbol");
        request.setClientName("Juan Perez");
        request.setClientEmail("juan@gmail.com");
        request.setDate("2026-08-10");
        request.setTimeSlot("16:00 - 17:00");
        request.setPrice(50.0);
        request.setStatus("reserved");
        request.setPaymentMethod("Efectivo");

        ResponseBookingGet response = businessBooking.insert(request);

        assertNotNull(response);
        assertEquals("success", response.getType());
        assertEquals("reserved", response.getStatus());
        verify(repositoryBooking, times(1)).save(any(EntityBooking.class));
    }

    @Test
    void testCancel_Success() {
        RequestBookingCancel request = new RequestBookingCancel();
        request.setBookingId("b-123");

        when(repositoryBooking.findById("b-123")).thenReturn(Optional.of(mockBooking));

        ResponseBookingGet response = businessBooking.cancel(request);

        assertNotNull(response);
        assertEquals("success", response.getType());
        assertEquals("cancelled", response.getStatus());
        verify(repositoryBooking, times(1)).save(any(EntityBooking.class));
        verify(repositoryTransaction, times(1)).save(any(EntityTransaction.class));
    }

    @Test
    void testCancel_NotFound() {
        RequestBookingCancel request = new RequestBookingCancel();
        request.setBookingId("invalid-id");

        when(repositoryBooking.findById("invalid-id")).thenReturn(Optional.empty());

        ResponseBookingGet response = businessBooking.cancel(request);

        assertNotNull(response);
        assertEquals("error", response.getType());
        assertTrue(response.getListMessage().get(0).contains("no encontrada"));
    }
}