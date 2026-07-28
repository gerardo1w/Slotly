package com.epiis.reservacanchas.entity;

import com.epiis.reservacanchas.staticdata.EnumTransactionType;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "ttransaction")
public class EntityTransaction {

    @Id
    @Column(name = "idTransaction")
    private String idTransaction;

    @Column(name = "complexId", nullable = false)
    private String complexId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", columnDefinition = "VARCHAR(50)")
    private EnumTransactionType type; // INCOME, EXPENSE

    @Column(name = "description")
    private String description;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "date")
    private String date; // format: YYYY-MM-DD

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdAt")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updatedAt")
    private Date updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complexId", insertable = false, updatable = false)
    private EntityComplex parentComplex;

    public String getIdTransaction() {
        return idTransaction;
    }

    public void setIdTransaction(String idTransaction) {
        this.idTransaction = idTransaction;
    }

    public String getComplexId() {
        return complexId;
    }

    public void setComplexId(String complexId) {
        this.complexId = complexId;
    }

    public EnumTransactionType getType() {
        return type;
    }

    public void setType(EnumTransactionType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
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
