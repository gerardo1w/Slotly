package com.epiis.reservacanchas.business;

import com.epiis.reservacanchas.entity.EntityBooking;
import com.epiis.reservacanchas.entity.EntityTransaction;
import com.epiis.reservacanchas.repository.RepositoryBooking;
import com.epiis.reservacanchas.repository.RepositoryTransaction;
import com.epiis.reservacanchas.dto.request.RequestBookingInsert;
import com.epiis.reservacanchas.dto.request.RequestBookingCancel;
import com.epiis.reservacanchas.dto.response.ResponseBookingGet;
import com.epiis.reservacanchas.staticdata.EnumBookingStatus;
import com.epiis.reservacanchas.staticdata.EnumTransactionType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class BusinessBooking {

    private final RepositoryBooking repositoryBooking;
    private final RepositoryTransaction repositoryTransaction;

    public BusinessBooking(RepositoryBooking repositoryBooking, RepositoryTransaction repositoryTransaction) {
        this.repositoryBooking = repositoryBooking;
        this.repositoryTransaction = repositoryTransaction;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAll(String clientEmail, String complexId) {
        List<EntityBooking> bookings;
        if (clientEmail != null && !clientEmail.isEmpty()) {
            bookings = repositoryBooking.findByClientEmail(clientEmail);
        } else if (complexId != null && !complexId.isEmpty()) {
            bookings = repositoryBooking.findByComplexId(complexId);
        } else {
            bookings = repositoryBooking.findAll();
        }

        List<Map<String, Object>> list = new ArrayList<>();
        for (EntityBooking b : bookings) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", b.getIdBooking());
            map.put("pitchId", b.getPitchId());
            map.put("complexId", b.getComplexId());
            map.put("complexName", b.getComplexName());
            map.put("pitchName", b.getPitchName());
            map.put("sport", b.getSport());
            map.put("clientName", b.getClientName());
            map.put("clientEmail", b.getClientEmail());
            map.put("date", b.getDate());
            map.put("timeSlot", b.getTimeSlot());
            map.put("price", b.getPrice());
            map.put("status", b.getStatus().name().toLowerCase());
            map.put("paymentMethod", b.getPaymentMethod());
            list.add(map);
        }
        return list;
    }

    @Transactional
    public ResponseBookingGet insert(RequestBookingInsert request) {
        ResponseBookingGet response = new ResponseBookingGet();

        EntityBooking booking = new EntityBooking();
        booking.setIdBooking(UUID.randomUUID().toString());
        booking.setPitchId(request.getPitchId());
        booking.setComplexId(request.getComplexId());
        booking.setComplexName(request.getComplexName());
        booking.setPitchName(request.getPitchName());
        booking.setSport(request.getSport());
        booking.setClientName(request.getClientName());
        booking.setClientEmail(request.getClientEmail());
        booking.setDate(request.getDate());
        booking.setTimeSlot(request.getTimeSlot());
        booking.setPrice(request.getPrice());
        // Determine status from request: 'reserved' → RESERVED, otherwise → ACTIVE
        EnumBookingStatus bookingStatus = EnumBookingStatus.ACTIVE;
        if ("reserved".equalsIgnoreCase(request.getStatus())) {
            bookingStatus = EnumBookingStatus.RESERVED;
        }
        booking.setStatus(bookingStatus);
        booking.setPaymentMethod(request.getPaymentMethod());
        booking.setCreatedAt(new Date());
        booking.setUpdatedAt(new Date());

        repositoryBooking.save(booking);

        EntityTransaction transaction = new EntityTransaction();
        transaction.setIdTransaction(UUID.randomUUID().toString());
        transaction.setComplexId(request.getComplexId());
        transaction.setType(EnumTransactionType.INCOME);
        transaction.setDescription("Reserva de cancha: " + request.getPitchName() + " (" + request.getClientName() + ")");
        transaction.setAmount(request.getPrice());
        transaction.setDate(request.getDate());
        transaction.setCreatedAt(new Date());
        transaction.setUpdatedAt(new Date());

        repositoryTransaction.save(transaction);

        response.setId(booking.getIdBooking());
        response.setPitchId(booking.getPitchId());
        response.setComplexId(booking.getComplexId());
        response.setComplexName(booking.getComplexName());
        response.setPitchName(booking.getPitchName());
        response.setSport(booking.getSport());
        response.setClientName(booking.getClientName());
        response.setClientEmail(booking.getClientEmail());
        response.setDate(booking.getDate());
        response.setTimeSlot(booking.getTimeSlot());
        response.setPrice(booking.getPrice());
        response.setStatus(booking.getStatus().name().toLowerCase());
        response.setPaymentMethod(booking.getPaymentMethod());

        response.success();
        response.getListMessage().add("Reserva registrada exitosamente.");
        return response;
    }

    @Transactional
    public ResponseBookingGet cancel(RequestBookingCancel request) {
        ResponseBookingGet response = new ResponseBookingGet();
        Optional<EntityBooking> optionalBooking = repositoryBooking.findById(request.getBookingId());

        if (optionalBooking.isEmpty()) {
            response.error();
            response.getListMessage().add("Reserva no encontrada.");
            return response;
        }

        EntityBooking booking = optionalBooking.get();
        booking.setStatus(EnumBookingStatus.CANCELLED);
        booking.setUpdatedAt(new Date());
        repositoryBooking.save(booking);

        EntityTransaction transaction = new EntityTransaction();
        transaction.setIdTransaction(UUID.randomUUID().toString());
        transaction.setComplexId(booking.getComplexId());
        transaction.setType(EnumTransactionType.EXPENSE);
        transaction.setDescription("Reembolso / Cancelación de reserva: " + booking.getPitchName());
        transaction.setAmount(booking.getPrice());
        transaction.setDate(booking.getDate());
        transaction.setCreatedAt(new Date());
        transaction.setUpdatedAt(new Date());
        repositoryTransaction.save(transaction);

        response.setId(booking.getIdBooking());
        response.setPitchId(booking.getPitchId());
        response.setComplexId(booking.getComplexId());
        response.setComplexName(booking.getComplexName());
        response.setPitchName(booking.getPitchName());
        response.setSport(booking.getSport());
        response.setClientName(booking.getClientName());
        response.setClientEmail(booking.getClientEmail());
        response.setDate(booking.getDate());
        response.setTimeSlot(booking.getTimeSlot());
        response.setPrice(booking.getPrice());
        response.setStatus(booking.getStatus().name().toLowerCase());
        response.setPaymentMethod(booking.getPaymentMethod());

        response.success();
        response.getListMessage().add("Reserva cancelada exitosamente.");
        return response;
    }
}
