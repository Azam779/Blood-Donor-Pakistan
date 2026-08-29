package com.blooddonorpakistan.app;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.blooddonorpakistan.app.model.Donor;
import com.blooddonorpakistan.app.utils.FirebaseManager;
import com.blooddonorpakistan.app.utils.LocationHelper;
import com.blooddonorpakistan.app.utils.ValidationUtils;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.materialswitch.MaterialSwitch;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.auth.FirebaseUser;
import java.util.List;

public class DonateActivity extends AppCompatActivity {

    private TextInputLayout tilName, tilPhone, tilAge, tilBloodGroup, tilDistrict, tilCity, tilArea, tilAddress;
    private TextInputEditText etName, etPhone, etAge, etArea, etAddress;
    private AutoCompleteTextView actvBloodGroup, actvDistrict, actvCity;
    private MaterialSwitch switchAvailable;
    private MaterialButton btnRegister;
    private ProgressBar pbLoading;
    private MaterialToolbar toolbar;

    private FirebaseManager firebaseManager;
    private String selectedDistrict = "";
    private String selectedCity = "";
    private String selectedBloodGroup = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_donate);

        firebaseManager = FirebaseManager.getInstance();

        initViews();
        setupDropdowns();
        prefillAuthDetails();
        setupListeners();
    }

    private void initViews() {
        toolbar = findViewById(R.id.toolbar_donate);
        toolbar.setNavigationOnClickListener(v -> finish());

        tilName = findViewById(R.id.til_name);
        tilPhone = findViewById(R.id.til_phone);
        tilAge = findViewById(R.id.til_age);
        tilBloodGroup = findViewById(R.id.til_blood_group);
        tilDistrict = findViewById(R.id.til_district);
        tilCity = findViewById(R.id.til_city);
        tilArea = findViewById(R.id.til_area);
        tilAddress = findViewById(R.id.til_address);

        etName = findViewById(R.id.et_name);
        etPhone = findViewById(R.id.et_phone);
        etAge = findViewById(R.id.et_age);
        etArea = findViewById(R.id.et_area);
        etAddress = findViewById(R.id.et_address);

        actvBloodGroup = findViewById(R.id.actv_blood_group);
        actvDistrict = findViewById(R.id.actv_district);
        actvCity = findViewById(R.id.actv_city);
        switchAvailable = findViewById(R.id.switch_available);

        btnRegister = findViewById(R.id.btn_register);
        pbLoading = findViewById(R.id.pb_register_loading);
    }

    private void setupDropdowns() {
        // Blood Groups
        String[] bloodGroups = LocationHelper.getBloodGroups();
        ArrayAdapter<String> bgAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, bloodGroups);
        actvBloodGroup.setAdapter(bgAdapter);
        actvBloodGroup.setOnItemClickListener((parent, view, position, id) -> {
            selectedBloodGroup = bloodGroups[position];
            tilBloodGroup.setError(null);
        });

        // Districts (Punjab)
        List<String> districts = LocationHelper.getDistricts(this);
        ArrayAdapter<String> districtAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, districts);
        actvDistrict.setAdapter(districtAdapter);

        // Cascading Dropdown: District -> City
        actvDistrict.setOnItemClickListener((parent, view, position, id) -> {
            selectedDistrict = districts.get(position);
            tilDistrict.setError(null);

            // Populate Cities for this District
            List<String> cities = LocationHelper.getCitiesForDistrict(DonateActivity.this, selectedDistrict);
            ArrayAdapter<String> cityAdapter = new ArrayAdapter<>(DonateActivity.this, android.R.layout.simple_dropdown_item_1line, cities);
            actvCity.setAdapter(cityAdapter);
            actvCity.setText("", false);
            selectedCity = "";
        });

        actvCity.setOnItemClickListener((parent, view, position, id) -> {
            selectedCity = (String) parent.getItemAtPosition(position);
            tilCity.setError(null);
        });
    }

    private void prefillAuthDetails() {
        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        if (currentUser != null) {
            if (currentUser.getPhoneNumber() != null && !currentUser.getPhoneNumber().isEmpty()) {
                etPhone.setText(currentUser.getPhoneNumber());
            }
            if (currentUser.getDisplayName() != null && !currentUser.getDisplayName().isEmpty()) {
                etName.setText(currentUser.getDisplayName());
            }
        }
    }

    private void setupListeners() {
        btnRegister.setOnClickListener(v -> handleRegistration());
    }

    private void handleRegistration() {
        // Reset errors
        tilName.setError(null);
        tilPhone.setError(null);
        tilAge.setError(null);
        tilBloodGroup.setError(null);
        tilDistrict.setError(null);
        tilCity.setError(null);

        String name = etName.getText() != null ? etName.getText().toString().trim() : "";
        String phone = etPhone.getText() != null ? etPhone.getText().toString().trim() : "";
        String ageStr = etAge.getText() != null ? etAge.getText().toString().trim() : "";
        String area = etArea.getText() != null ? etArea.getText().toString().trim() : "";
        String address = etAddress.getText() != null ? etAddress.getText().toString().trim() : "";
        boolean isAvailable = switchAvailable.isChecked();

        // Validation
        boolean isValid = true;

        if (!ValidationUtils.isValidName(name)) {
            tilName.setError(getString(R.string.err_name_required));
            isValid = false;
        }

        if (!ValidationUtils.isValidPhone(phone)) {
            tilPhone.setError(getString(R.string.err_phone_invalid));
            isValid = false;
        }

        if (!ValidationUtils.isValidAge(ageStr)) {
            tilAge.setError(getString(R.string.err_age_invalid));
            isValid = false;
        }

        if (selectedBloodGroup == null || selectedBloodGroup.trim().isEmpty()) {
            tilBloodGroup.setError(getString(R.string.err_blood_group_required));
            isValid = false;
        }

        if (selectedDistrict == null || selectedDistrict.trim().isEmpty()) {
            tilDistrict.setError(getString(R.string.err_district_required));
            isValid = false;
        }

        if (selectedCity == null || selectedCity.trim().isEmpty()) {
            tilCity.setError(getString(R.string.err_city_required));
            isValid = false;
        }

        if (!isValid) {
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

        setLoading(true);

        firebaseManager.saveDonor(donor)
                .addOnSuccessListener(aVoid -> {
                    setLoading(false);
                    Intent successIntent = new Intent(DonateActivity.this, RegistrationSuccessActivity.class);
                    successIntent.putExtra("donor", donor);
                    startActivity(successIntent);
                    finish();
                })
                .addOnFailureListener(e -> {
                    setLoading(false);
                    Toast.makeText(DonateActivity.this, "Error saving donor record: " + e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
                });
    }

    private void setLoading(boolean loading) {
        btnRegister.setVisibility(loading ? View.INVISIBLE : View.VISIBLE);
        pbLoading.setVisibility(loading ? View.VISIBLE : View.GONE);
        btnRegister.setEnabled(!loading);
    }
}
