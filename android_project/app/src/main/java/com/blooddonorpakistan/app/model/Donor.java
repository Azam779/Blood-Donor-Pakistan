package com.blooddonorpakistan.app.model;

import com.google.firebase.firestore.DocumentId;
import com.google.firebase.firestore.ServerTimestamp;
import java.io.Serializable;
import java.util.Date;

/**
 * Model representing a registered blood donor in Blood Donor Pakistan.
 */
public class Donor implements Serializable {

    @DocumentId
    private String id;
    private String uid;
    private String name;
    private String phone;
    private int age;
    private String bloodGroup;
    private String province;
    private String district;
    private String city;
    private String area;
    private String address;
    private boolean available;
    private String role;

    @ServerTimestamp
    private Date createdAt;

    @ServerTimestamp
    private Date updatedAt;

    // Required empty constructor for Firestore deserialization
    public Donor() {
    }

    public Donor(String uid, String name, String phone, int age, String bloodGroup,
                 String province, String district, String city, String area,
                 String address, boolean available) {
        this.uid = uid;
        this.name = name;
        this.phone = phone;
        this.age = age;
        this.bloodGroup = bloodGroup;
        this.province = province != null ? province : "Punjab";
        this.district = district;
        this.city = city;
        this.area = area != null ? area : "";
        this.address = address != null ? address : "";
        this.available = available;
        this.role = "user";
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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
