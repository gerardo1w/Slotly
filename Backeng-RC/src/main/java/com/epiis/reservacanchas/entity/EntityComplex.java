package com.epiis.reservacanchas.entity;

import com.epiis.reservacanchas.staticdata.EnumComplexStatus;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "tcomplex")
public class EntityComplex {

    @Id
    @Column(name = "idComplex")
    private String idComplex;

    @Column(name = "name")
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "district")
    private String district;

    @Column(name = "ownerId")
    private String ownerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "VARCHAR(50)")
    private EnumComplexStatus status;

    @Column(name = "phone")
    private String phone;

    @Column(name = "image")
    private String image;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "reviewsCount")
    private Integer reviewsCount;

    @Column(name = "pitchesCount")
    private Integer pitchesCount;

    @Column(name = "timeRange")
    private String timeRange;

    @Column(name = "active")
    private Boolean active;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdAt")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updatedAt")
    private Date updatedAt;

    @OneToMany(mappedBy = "parentComplex", cascade = CascadeType.ALL)
    private List<EntityPitch> childPitch;

    public String getIdComplex() {
        return idComplex;
    }

    public void setIdComplex(String idComplex) {
        this.idComplex = idComplex;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public EnumComplexStatus getStatus() {
        return status;
    }

    public void setStatus(EnumComplexStatus status) {
        this.status = status;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(Integer reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public Integer getPitchesCount() {
        return pitchesCount;
    }

    public void setPitchesCount(Integer pitchesCount) {
        this.pitchesCount = pitchesCount;
    }

    public String getTimeRange() {
        return timeRange;
    }

    public void setTimeRange(String timeRange) {
        this.timeRange = timeRange;
    }

    public Boolean getActive() {
        return active == null || active;
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

    public List<EntityPitch> getChildPitch() {
        return childPitch;
    }

    public void setChildPitch(List<EntityPitch> childPitch) {
        this.childPitch = childPitch;
    }
}
