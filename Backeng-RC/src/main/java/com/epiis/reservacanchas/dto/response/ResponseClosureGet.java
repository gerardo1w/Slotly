package com.epiis.reservacanchas.dto.response;

import com.epiis.reservacanchas.generic.ResponseGeneric;

public class ResponseClosureGet extends ResponseGeneric {
    private String id;
    private String complexId;
    private String date;
    private Double totalIncomes;
    private Double totalExpenses;
    private Double finalBalance;
    private String closedBy;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
}
