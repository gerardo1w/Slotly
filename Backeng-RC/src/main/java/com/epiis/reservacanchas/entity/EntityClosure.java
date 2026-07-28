package com.epiis.reservacanchas.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tclosure")
public class EntityClosure {

    @Id
    @Column(name = "idClosure")
    private String idClosure;

    @Column(name = "complexId", nullable = false)
    private String complexId;

    @Column(name = "date")
    private String date; // format: YYYY-MM-DD

    @Column(name = "totalIncomes")
    private Double totalIncomes;

    @Column(name = "totalExpenses")
    private Double totalExpenses;

    @Column(name = "finalBalance")
    private Double finalBalance;

    @Column(name = "closedBy")
    private String closedBy; // User/Email that closed

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdAt")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updatedAt")
    private Date updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complexId", insertable = false, updatable = false)
    private EntityComplex parentComplex;

    public String getIdClosure() {
        return idClosure;
    }

    public void setIdClosure(String idClosure) {
        this.idClosure = idClosure;
    }

    public String getComplexId() {
        return complexId;
    }

    public void setComplexId(String complexId) {
        this.complexId = complexId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Double getTotalIncomes() {
        return totalIncomes;
    }

    public void setTotalIncomes(Double totalIncomes) {
        this.totalIncomes = totalIncomes;
    }

    public Double getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(Double totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public Double getFinalBalance() {
        return finalBalance;
    }

    public void setFinalBalance(Double finalBalance) {
        this.finalBalance = finalBalance;
    }

    public String getClosedBy() {
        return closedBy;
    }

    public void setClosedBy(String closedBy) {
        this.closedBy = closedBy;
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
}
