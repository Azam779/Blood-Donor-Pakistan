package com.blooddonorpakistan.app.utils;

import com.blooddonorpakistan.app.model.Donor;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QuerySnapshot;
import java.util.HashMap;
import java.util.Map;

/**
 * Firebase Firestore and Authentication helper for Blood Donor Pakistan.
 */
public class FirebaseManager {

    private static final String COLLECTION_DONORS = "donors";
    private static FirebaseManager instance;
    private final FirebaseFirestore db;
    private final FirebaseAuth auth;

    private FirebaseManager() {
        this.db = FirebaseFirestore.getInstance();
        this.auth = FirebaseAuth.getInstance();
    }

    public static synchronized FirebaseManager getInstance() {
        if (instance == null) {
            instance = new FirebaseManager();
        }
        return instance;
    }

    public FirebaseFirestore getDb() {
        return db;
    }

    public FirebaseAuth getAuth() {
        return auth;
    }

    public FirebaseUser getCurrentUser() {
        return auth.getCurrentUser();
    }

    public boolean isSignedIn() {
        return auth.getCurrentUser() != null;
    }

    public String getCurrentUserId() {
        FirebaseUser user = getCurrentUser();
        return user != null ? user.getUid() : null;
    }

    /**
     * Save or update donor profile using their UID as document ID.
     */
    public Task<Void> saveDonor(Donor donor) {
        String uid = donor.getUid();
        if (uid == null && getCurrentUser() != null) {
            uid = getCurrentUser().getUid();
            donor.setUid(uid);
        }

        DocumentReference docRef = db.collection(COLLECTION_DONORS).document(uid);

        Map<String, Object> data = new HashMap<>();
        data.put("uid", donor.getUid());
        data.put("name", donor.getName());
        data.put("phone", donor.getPhone());
        data.put("age", donor.getAge());
        data.put("bloodGroup", donor.getBloodGroup());
        data.put("province", donor.getProvince());
        data.put("district", donor.getDistrict());
        data.put("city", donor.getCity());
        data.put("area", donor.getArea());
        data.put("address", donor.getAddress());
        data.put("available", donor.isAvailable());
        data.put("role", "user");
        data.put("updatedAt", FieldValue.serverTimestamp());

        // Set createdAt if new
        return docRef.get().continueWithTask(task -> {
            if (task.isSuccessful() && task.getResult() != null && task.getResult().exists()) {
                // Existing document, keep original createdAt
                return docRef.update(data);
            } else {
                data.put("createdAt", FieldValue.serverTimestamp());
                return docRef.set(data);
            }
        });
    }

    /**
     * Update only the availability state of a donor.
     */
    public Task<Void> updateAvailability(String uid, boolean available) {
        Map<String, Object> updates = new HashMap<>();
        updates.put("available", available);
        updates.put("updatedAt", FieldValue.serverTimestamp());
        return db.collection(COLLECTION_DONORS).document(uid).update(updates);
    }

    /**
     * Fetch the donor profile for a specific user ID.
     */
    public Task<DocumentSnapshot> getDonorProfile(String uid) {
        return db.collection(COLLECTION_DONORS).document(uid).get();
    }

    /**
     * Delete donor profile from Firestore.
     */
    public Task<Void> deleteDonorProfile(String uid) {
        return db.collection(COLLECTION_DONORS).document(uid).delete();
    }

    /**
     * Query available donors with compound filters on Firestore.
     */
    public Query buildSearchQuery(String bloodGroup, String district, String city) {
        Query query = db.collection(COLLECTION_DONORS).whereEqualTo("available", true);

        if (bloodGroup != null && !bloodGroup.isEmpty() && !bloodGroup.equalsIgnoreCase("Any")) {
            query = query.whereEqualTo("bloodGroup", bloodGroup.trim());
        }

        if (district != null && !district.isEmpty() && !district.equalsIgnoreCase("All")) {
            query = query.whereEqualTo("district", district.trim());
        }

        if (city != null && !city.isEmpty() && !city.equalsIgnoreCase("All")) {
            query = query.whereEqualTo("city", city.trim());
        }

        return query;
    }
}
