package com.epiis.reservacanchas.entity;

import com.epiis.reservacanchas.staticdata.EnumBookingStatus;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tbooking")
public class EntityBooking {

    @Id
    @Column(name = "idBooking")
    private String idBooking;

    @Column(name = "pitchId", nullable = false)
    private String pitchId;

    @Column(name = "complexId", nullable = false)
    private String complexId;

    @Column(name = "complexName")
    private String complexName;

    @Column(name = "pitchName")
    private String pitchName;

    @Column(name = "sport")
    private String sport;

    @Column(name = "clientName")
    private String clientName;

    @Column(name = "clientEmail")
    private String clientEmail;

    @Column(name = "date")
    private String date; // format: YYYY-MM-DD

    @Column(name = "timeSlot")
    private String timeSlot; // format: HH:mm - HH:mm

    @Column(name = "price")
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "VARCHAR(50)")
    private EnumBookingStatus status;

    @Column(name = "paymentMethod")
    private String paymentMethod; // 'Yape', 'Plin', 'Culqi'

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdAt")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updatedAt")
    private Date updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pitchId", insertable = false, updatable = false)
    private EntityPitch parentPitch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complexId", insertable = false, updatable = false)
    private EntityComplex parentComplex;

    public String getIdBooking() {
        return idBooking;
    }

    public void setIdBooking(String idBooking) {
        this.idBooking = idBooking;
    }

    public String getPitchId() {
        return pitchId;
    }

    public void setPitchId(String pitchId) {
        this.pitchId = pitchId;
    }

    public String getComplexId() {
        return complexId;
    }

    public void setComplexId(String complexId) {
        this.complexId = complexId;
    }

    public String getComplexName() {
        return complexName;
    }

    public void setComplexName(String complexName) {
        this.complexName = complexName;
    }

    public String getPitchName() {
        return pitchName;
    }

    public void setPitchName(String pitchName) {
        this.pitchName = pitchName;
    }

    public String getSport() {
        return sport;
    }

    public void setSport(String sport) {
        this.sport = sport;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public EnumBookingStatus getStatus() {
        return status;
    }

    public void setStatus(EnumBookingStatus status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public EntityPitch getParentPitch() {
        return parentPitch;
    }

    public void setParentPitch(EntityPitch parentPitch) {
        this.parentPitch = parentPitch;
    }

    public EntityComplex getParentComplex() {
        return parentComplex;
    }

    public void setParentComplex(EntityComplex parentComplex) {
        this.parentComplex = parentComplex;
    }
}
