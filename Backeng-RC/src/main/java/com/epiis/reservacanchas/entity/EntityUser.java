package com.epiis.reservacanchas.entity;

import com.epiis.reservacanchas.staticdata.EnumUserRole;
import com.epiis.reservacanchas.staticdata.EnumSubscriptionType;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tuser")
public class EntityUser {

    @Id
    @Column(name = "idUser")
    private String idUser;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", columnDefinition = "VARCHAR(50)")
    private EnumUserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription", columnDefinition = "VARCHAR(50)")
    private EnumSubscriptionType subscription;

    @Column(name = "complexId")
    private String complexId;

    @Column(name = "blocked")
    private Boolean blocked;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdAt")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updatedAt")
    private Date updatedAt;

    public String getIdUser() {
        return idUser;
    }

    public void setIdUser(String idUser) {
        this.idUser = idUser;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public EnumUserRole getRole() {
        return role;
    }

    public void setRole(EnumUserRole role) {
        this.role = role;
    }

    public EnumSubscriptionType getSubscription() {
        return subscription;
    }

    public void setSubscription(EnumSubscriptionType subscription) {
        this.subscription = subscription;
    }

    public String getComplexId() {
        return complexId;
    }

    public void setComplexId(String complexId) {
        this.complexId = complexId;
    }

    public Boolean getBlocked() {
        return blocked;
    }

    public void setBlocked(Boolean blocked) {
        this.blocked = blocked;
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
}
