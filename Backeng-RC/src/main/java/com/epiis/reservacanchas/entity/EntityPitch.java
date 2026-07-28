package com.epiis.reservacanchas.entity;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "tpitch")
public class EntityPitch {

    @Id
    @Column(name = "idPitch")
    private String idPitch;

    @Column(name = "complexId", nullable = false)
    private String complexId;

    @Column(name = "name")
    private String name;

    @Column(name = "sport")
    private String sport; // 'Fútbol', 'Tenis', 'Básquet', 'Pádel', 'Vóley'

    @Column(name = "pricePerHour")
    private Double pricePerHour;

    @Column(name = "image")
    private String image;

    @Column(name = "active")
    private Boolean active;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdAt")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updatedAt")
    private Date updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complexId", insertable = false, updatable = false)
    private EntityComplex parentComplex;

    @OneToMany(mappedBy = "parentPitch", cascade = CascadeType.ALL)
    private List<EntityBooking> childBooking;

    public String getIdPitch() {
        return idPitch;
    }

    public void setIdPitch(String idPitch) {
        this.idPitch = idPitch;
    }

    public String getComplexId() {
        return complexId;
    }

    public void setComplexId(String complexId) {
        this.complexId = complexId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSport() {
        return sport;
    }

    public void setSport(String sport) {
        this.sport = sport;
    }

    public Double getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(Double pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
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

    public EntityComplex getParentComplex() {
        return parentComplex;
    }

    public void setParentComplex(EntityComplex parentComplex) {
        this.parentComplex = parentComplex;
    }

    public List<EntityBooking> getChildBooking() {
        return childBooking;
    }

    public void setChildBooking(List<EntityBooking> childBooking) {
        this.childBooking = childBooking;
    }
}
