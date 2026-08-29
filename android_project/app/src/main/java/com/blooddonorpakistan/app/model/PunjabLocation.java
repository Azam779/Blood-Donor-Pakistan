package com.blooddonorpakistan.app.model;

import java.io.Serializable;
import java.util.List;

public class PunjabLocation implements Serializable {
    private String name;
    private List<String> cities;

    public PunjabLocation() {
    }

    public PunjabLocation(String name, List<String> cities) {
        this.name = name;
        this.cities = cities;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getCities() {
        return cities;
    }

    public void setCities(List<String> cities) {
        this.cities = cities;
    }
}
