package com.epiis.reservacanchas.generic;

import java.util.ArrayList;
import java.util.List;

public abstract class ResponseGeneric {
    private String type; // success, warning, error, exception
    private List<String> listMessage = new ArrayList<>();

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<String> getListMessage() {
        return listMessage;
    }

    public void setListMessage(List<String> listMessage) {
        this.listMessage = listMessage;
    }

    public void success() {
        this.type = "success";
    }

    public void warning() {
        this.type = "warning";
    }

    public void error() {
        this.type = "error";
    }

    public void exception() {
        this.type = "exception";
    }
}
