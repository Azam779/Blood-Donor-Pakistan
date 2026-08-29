package com.blooddonorpakistan.app;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import com.blooddonorpakistan.app.model.Donor;
import com.blooddonorpakistan.app.utils.FirebaseManager;
import com.blooddonorpakistan.app.utils.LocationHelper;
import com.blooddonorpakistan.app.utils.ValidationUtils;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.materialswitch.MaterialSwitch;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import java.util.List;

public class DonorProfileActivity extends AppCompatActivity {

    private MaterialToolbar toolbar;
    private MaterialCardView cardAvailabilityStatus;
    private TextView tvStatusTitle, tvStatusDesc;
    private MaterialSwitch switchProfileAvailable;

    private TextInputLayout tilName, tilPhone, tilAge, tilBloodGroup, tilDistrict, tilCity, tilArea, tilAddress;
    private TextInputEditText etName, etPhone, etAge, etArea, etAddress;
    private AutoCompleteTextView actvBloodGroup, actvDistrict, actvCity;

    private MaterialButton btnUpdateProfile, btnDeleteProfile, btnLogout;

    private FirebaseManager firebaseManager;
    private Donor currentDonor;
    private String selectedDistrict = "";
    private String selectedCity = "";
    private String selectedBloodGroup = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_donor_profile);

        firebaseManager = FirebaseManager.getInstance();
        if (!firebaseManager.isSignedIn()) {
            Toast.makeText(this, "Please sign in to view your profile.", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        initViews();
        setupDropdowns();
        loadProfileData();
        setupListeners();
    }

    private void initViews() {
        toolbar = findViewById(R.id.toolbar_profile);
        toolbar.setNavigationOnClickListener(v -> finish());

        cardAvailabilityStatus = findViewById(R.id.card_availability_status);
        tvStatusTitle = findViewById(R.id.tv_status_title);
        tvStatusDesc = findViewById(R.id.tv_status_desc);
        switchProfileAvailable = findViewById(R.id.switch_profile_available);

        tilName = findViewById(R.id.til_profile_name);
        tilPhone = findViewById(R.id.til_profile_phone);
        tilAge = findViewById(R.id.til_profile_age);
        tilBloodGroup = findViewById(R.id.til_profile_blood_group);
        tilDistrict = findViewById(R.id.til_profile_district);
        tilCity = findViewById(R.id.til_profile_city);
        tilArea = findViewById(R.id.til_profile_area);
        tilAddress = findViewById(R.id.til_profile_address);

        etName = findViewById(R.id.et_profile_name);
        etPhone = findViewById(R.id.et_profile_phone);
        etAge = findViewById(R.id.et_profile_age);
        etArea = findViewById(R.id.et_profile_area);
        etAddress = findViewById(R.id.et_profile_address);

        actvBloodGroup = findViewById(R.id.actv_profile_blood_group);
        actvDistrict = findViewById(R.id.actv_profile_district);
        actvCity = findViewById(R.id.actv_profile_city);

        btnUpdateProfile = findViewById(R.id.btn_update_profile);
        btnDeleteProfile = findViewById(R.id.btn_delete_profile);
        btnLogout = findViewById(R.id.btn_logout);
    }

    private void setupDropdowns() {
        // Blood Groups
        String[] bloodGroups = LocationHelper.getBloodGroups();
        ArrayAdapter<String> bgAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, bloodGroups);
        actvBloodGroup.setAdapter(bgAdapter);
        actvBloodGroup.setOnItemClickListener((parent, view, position, id) -> selectedBloodGroup = bloodGroups[position]);

        // Districts (Punjab)
        List<String> districts = LocationHelper.getDistricts(this);
        ArrayAdapter<String> districtAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, districts);
        actvDistrict.setAdapter(districtAdapter);

        // Cascading Dropdown: District -> City
        actvDistrict.setOnItemClickListener((parent, view, position, id) -> {
            selectedDistrict = districts.get(position);
            updateCitiesDropdown(selectedDistrict, "");
        });

        actvCity.setOnItemClickListener((parent, view, position, id) -> selectedCity = (String) parent.getItemAtPosition(position));
    }

    private void updateCitiesDropdown(String district, String preselectedCity) {
        List<String> cities = LocationHelper.getCitiesForDistrict(this, district);
        ArrayAdapter<String> cityAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, cities);
        actvCity.setAdapter(cityAdapter);
        if (preselectedCity != null && !preselectedCity.isEmpty() && cities.contains(preselectedCity)) {
            actvCity.setText(preselectedCity, false);
            selectedCity = preselectedCity;
        } else {
            actvCity.setText("", false);
            selectedCity = "";
        }
    }

    private void loadProfileData() {
        String uid = firebaseManager.getCurrentUserId();
        if (uid == null) return;

        firebaseManager.getDonorProfile(uid).addOnSuccessListener(doc -> {
            if (doc != null && doc.exists()) {
                currentDonor = doc.toObject(Donor.class);
                if (currentDonor != null) {
                    currentDonor.setId(doc.getId());
                    populateForm(currentDonor);
                }
            } else {
                Toast.makeText(this, "No donor profile found for your account. Please register as a donor.", Toast.LENGTH_LONG).show();
            }
        }).addOnFailureListener(e -> Toast.makeText(this, "Failed to load profile: " + e.getLocalizedMessage(), Toast.LENGTH_SHORT).show());
    }

    private void populateForm(Donor donor) {
        etName.setText(donor.getName());
        etPhone.setText(donor.getPhone());
        etAge.setText(String.valueOf(donor.getAge()));
        etArea.setText(donor.getArea());
        etAddress.setText(donor.getAddress());

        selectedBloodGroup = donor.getBloodGroup();
        actvBloodGroup.setText(selectedBloodGroup, false);

        selectedDistrict = donor.getDistrict();
        actvDistrict.setText(selectedDistrict, false);
        updateCitiesDropdown(selectedDistrict, donor.getCity());

        switchProfileAvailable.setChecked(donor.isAvailable());
        updateAvailabilityUI(donor.isAvailable());
    }

    private void updateAvailabilityUI(boolean available) {
        if (available) {
            tvStatusTitle.setText("Active & Available");
            tvStatusTitle.setTextColor(getResources().getColor(R.color.status_available));
            tvStatusDesc.setText("You are currently visible in blood donor search results.");
            cardAvailabilityStatus.setStrokeColor(getResources().getColor(R.color.status_available));
        } else {
            tvStatusTitle.setText("Temporarily Unavailable");
            tvStatusTitle.setTextColor(getResources().getColor(R.color.status_unavailable));
            tvStatusDesc.setText("You are hidden from public blood donor searches.");
            cardAvailabilityStatus.setStrokeColor(getResources().getColor(R.color.status_unavailable));
        }
    }

    private void setupListeners() {
        // Live Availability Toggle
        switchProfileAvailable.setOnCheckedChangeListener((buttonView, isChecked) -> {
            updateAvailabilityUI(isChecked);
            String uid = firebaseManager.getCurrentUserId();
            if (uid != null) {
                firebaseManager.updateAvailability(uid, isChecked)
                        .addOnSuccessListener(aVoid -> Toast.makeText(DonorProfileActivity.this, isChecked ? "Availability turned ON" : "Availability turned OFF", Toast.LENGTH_SHORT).show())
                        .addOnFailureListener(e -> {
                            switchProfileAvailable.setChecked(!isChecked);
                            updateAvailabilityUI(!isChecked);
                            Toast.makeText(DonorProfileActivity.this, "Failed to update availability", Toast.LENGTH_SHORT).show();
                        });
            }
        });

        btnUpdateProfile.setOnClickListener(v -> saveChanges());
        btnDeleteProfile.setOnClickListener(v -> confirmDeleteProfile());
        btnLogout.setOnClickListener(v -> logout());
    }

    private void saveChanges() {
        String name = etName.getText() != null ? etName.getText().toString().trim() : "";
        String phone = etPhone.getText() != null ? etPhone.getText().toString().trim() : "";
        String ageStr = etAge.getText() != null ? etAge.getText().toString().trim() : "";
        String area = etArea.getText() != null ? etArea.getText().toString().trim() : "";
        String address = etAddress.getText() != null ? etAddress.getText().toString().trim() : "";
        boolean isAvailable = switchProfileAvailable.isChecked();

        if (!ValidationUtils.isValidName(name)) {
            tilName.setError(getString(R.string.err_name_required));
            return;
        }

        if (!ValidationUtils.isValidPhone(phone)) {
            tilPhone.setError(getString(R.string.err_phone_invalid));
            return;
        }

        if (!ValidationUtils.isValidAge(ageStr)) {
            tilAge.setError(getString(R.string.err_age_invalid));
            return;
        }

        if (selectedBloodGroup.isEmpty()) {
            tilBloodGroup.setError(getString(R.string.err_blood_group_required));
            return;
        }

        if (selectedDistrict.isEmpty()) {
            tilDistrict.setError(getString(R.string.err_district_required));
            return;
        }

        if (selectedCity.isEmpty()) {
            tilCity.setError(getString(R.string.err_city_required));
            return;
        }

        int age = Integer.parseInt(ageStr);
        String formattedPhone = ValidationUtils.formatPakistaniPhoneForAuth(phone);
        String uid = firebaseManager.getCurrentUserId();

        Donor donor = new Donor(
                uid,
                name,
                formattedPhone,
                age,
                selectedBloodGroup,
                "Punjab",
                selectedDistrict,
                selectedCity,
                area,
                address,
                isAvailable
        );

        btnUpdateProfile.setEnabled(false);
        firebaseManager.saveDonor(donor)
                .addOnSuccessListener(aVoid -> {
                    btnUpdateProfile.setEnabled(true);
                    Toast.makeText(DonorProfileActivity.this, "Profile updated successfully!", Toast.LENGTH_SHORT).show();
                    finish();
                })
                .addOnFailureListener(e -> {
                    btnUpdateProfile.setEnabled(true);
                    Toast.makeText(DonorProfileActivity.this, "Error: " + e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
                });
    }

    private void confirmDeleteProfile() {
        new AlertDialog.Builder(this)
                .setTitle("Delete Donor Profile")
                .setMessage("Are you sure you want to permanently delete your blood donor profile? You will no longer receive emergency blood requests.")
                .setPositiveButton("Delete", (dialog, which) -> {
                    String uid = firebaseManager.getCurrentUserId();
                    if (uid != null) {
                        firebaseManager.deleteDonorProfile(uid)
                                .addOnSuccessListener(aVoid -> {
                                    Toast.makeText(DonorProfileActivity.this, "Donor profile deleted.", Toast.LENGTH_SHORT).show();
                                    finish();
                                })
                                .addOnFailureListener(e -> Toast.makeText(DonorProfileActivity.this, "Failed to delete: " + e.getLocalizedMessage(), Toast.LENGTH_SHORT).show());
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void logout() {
        firebaseManager.getAuth().signOut();
        Toast.makeText(this, "Signed out successfully.", Toast.LENGTH_SHORT).show();
        Intent intent = new Intent(this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        finish();
    }
}
