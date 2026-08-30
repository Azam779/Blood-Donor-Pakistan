import { ProjectFile } from '../types';

export const ANDROID_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'android_project/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    type: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.blooddonorpakistan.app">

    <!-- Permissions required for Blood Donor Pakistan -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.BloodDonorPakistan"
        tools:targetApi="31">

        <!-- Splash Screen Activity (Launcher) -->
        <activity
            android:name=".SplashActivity"
            android:exported="true"
            android:theme="@style/Theme.BloodDonorPakistan.Splash">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Main Home Dashboard -->
        <activity
            android:name=".MainActivity"
            android:exported="false" />

        <!-- Donor Registration Form -->
        <activity
            android:name=".DonateActivity"
            android:exported="false"
            android:parentActivityName=".MainActivity" />

        <!-- Registration Success Screen -->
        <activity
            android:name=".RegistrationSuccessActivity"
            android:exported="false" />

        <!-- Search Donors Screen -->
        <activity
            android:name=".SearchDonorActivity"
            android:exported="false"
            android:parentActivityName=".MainActivity" />

        <!-- Donor Profile & Availability Management -->
        <activity
            android:name=".DonorProfileActivity"
            android:exported="false"
            android:parentActivityName=".MainActivity" />

        <!-- Phone Authentication Activities -->
        <activity
            android:name=".LoginActivity"
            android:exported="false"
            android:parentActivityName=".MainActivity" />

        <activity
            android:name=".OtpVerifyActivity"
            android:exported="false" />

    </application>

</manifest>`
  },
  {
    path: 'android_project/app/src/main/java/com/blooddonorpakistan/app/MainActivity.java',
    name: 'MainActivity.java',
    type: 'java',
    content: `package com.blooddonorpakistan.app;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import androidx.appcompat.app.AppCompatActivity;
import com.blooddonorpakistan.app.utils.FirebaseManager;
import com.blooddonorpakistan.app.utils.LocationHelper;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;

public class MainActivity extends AppCompatActivity {

    private MaterialCardView cardDonateBlood;
    private MaterialCardView cardFindBlood;
    private MaterialButton btnMainDonate;
    private MaterialButton btnMainFind;
    private MaterialButton btnMainProfile;
    private MaterialButton btnMainAbout;
    private MaterialToolbar toolbar;

    private FirebaseManager firebaseManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        firebaseManager = FirebaseManager.getInstance();
        LocationHelper.init(getApplicationContext());

        initViews();
        setupListeners();
    }

    private void initViews() {
        toolbar = findViewById(R.id.toolbar_main);
        cardDonateBlood = findViewById(R.id.card_donate_blood);
        cardFindBlood = findViewById(R.id.card_find_blood);
        btnMainDonate = findViewById(R.id.btn_main_donate);
        btnMainFind = findViewById(R.id.btn_main_find);
        btnMainProfile = findViewById(R.id.btn_main_my_profile);
        btnMainAbout = findViewById(R.id.btn_main_about);

        toolbar.setOnMenuItemClickListener(this::onToolbarMenuItemClick);
    }

    private void setupListeners() {
        // 1. DONATE BLOOD
        View.OnClickListener donateClickListener = v -> {
            if (firebaseManager.isSignedIn()) {
                Intent intent = new Intent(MainActivity.this, DonateActivity.class);
                startActivity(intent);
            } else {
                Intent intent = new Intent(MainActivity.this, LoginActivity.class);
                intent.putExtra("target_screen", "donate");
                startActivity(intent);
            }
        };

        cardDonateBlood.setOnClickListener(donateClickListener);
        btnMainDonate.setOnClickListener(donateClickListener);

        // 2. FIND BLOOD DONOR
        View.OnClickListener findClickListener = v -> {
            Intent intent = new Intent(MainActivity.this, SearchDonorActivity.class);
            startActivity(intent);
        };

        cardFindBlood.setOnClickListener(findClickListener);
        btnMainFind.setOnClickListener(findClickListener);

        // 3. MY DONOR PROFILE
        btnMainProfile.setOnClickListener(v -> {
            if (firebaseManager.isSignedIn()) {
                Intent intent = new Intent(MainActivity.this, DonorProfileActivity.class);
                startActivity(intent);
            } else {
                Intent intent = new Intent(MainActivity.this, LoginActivity.class);
                intent.putExtra("target_screen", "profile");
                startActivity(intent);
            }
        });

        // 4. ABOUT & EMERGENCY GUIDE
        btnMainAbout.setOnClickListener(v -> showAboutDialog());
    }

    private boolean onToolbarMenuItemClick(MenuItem item) {
        if (item.getItemId() == R.id.action_about) {
            showAboutDialog();
            return true;
        }
        return false;
    }

    private void showAboutDialog() {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_about);
        dialog.setCancelable(true);

        MaterialButton btnClose = dialog.findViewById(R.id.btn_dialog_close);
        if (btnClose != null) {
            btnClose.setOnClickListener(v -> dialog.dismiss());
        }

        dialog.show();
    }
}`
  },
  {
    path: 'android_project/app/src/main/java/com/blooddonorpakistan/app/DonateActivity.java',
    name: 'DonateActivity.java',
    type: 'java',
    content: `package com.blooddonorpakistan.app;

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
        String[] bloodGroups = LocationHelper.getBloodGroups();
        ArrayAdapter<String> bgAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, bloodGroups);
        actvBloodGroup.setAdapter(bgAdapter);
        actvBloodGroup.setOnItemClickListener((parent, view, position, id) -> {
            selectedBloodGroup = bloodGroups[position];
            tilBloodGroup.setError(null);
        });

        List<String> districts = LocationHelper.getDistricts(this);
        ArrayAdapter<String> districtAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, districts);
        actvDistrict.setAdapter(districtAdapter);

        // Cascading Dropdown: District -> City
        actvDistrict.setOnItemClickListener((parent, view, position, id) -> {
            selectedDistrict = districts.get(position);
            tilDistrict.setError(null);

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

        if (!isValid) return;

        int age = Integer.parseInt(ageStr);
        String formattedPhone = ValidationUtils.formatPakistaniPhoneForAuth(phone);
        String uid = firebaseManager.getCurrentUserId();

        Donor donor = new Donor(
                uid, name, formattedPhone, age, selectedBloodGroup,
                "Punjab", selectedDistrict, selectedCity, area, address, isAvailable
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
                    Toast.makeText(DonateActivity.this, "Error saving donor: " + e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
                });
    }

    private void setLoading(boolean loading) {
        btnRegister.setVisibility(loading ? View.INVISIBLE : View.VISIBLE);
        pbLoading.setVisibility(loading ? View.VISIBLE : View.GONE);
        btnRegister.setEnabled(!loading);
    }
}`
  },
  {
    path: 'android_project/app/src/main/java/com/blooddonorpakistan/app/SearchDonorActivity.java',
    name: 'SearchDonorActivity.java',
    type: 'java',
    content: `package com.blooddonorpakistan.app;

import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.blooddonorpakistan.app.adapter.DonorAdapter;
import com.blooddonorpakistan.app.model.Donor;
import com.blooddonorpakistan.app.utils.FirebaseManager;
import com.blooddonorpakistan.app.utils.LocationHelper;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.Query;
import java.util.ArrayList;
import java.util.List;

public class SearchDonorActivity extends AppCompatActivity {

    private AutoCompleteTextView actvSearchBloodGroup, actvSearchDistrict, actvSearchCity;
    private TextInputEditText etSearchArea;
    private MaterialButton btnSearchSubmit;
    private LinearLayout layoutResultsHeader, layoutLoading, layoutEmptyState;
    private TextView tvResultsCount;
    private RecyclerView rvDonors;
    private MaterialToolbar toolbar;

    private DonorAdapter donorAdapter;
    private FirebaseManager firebaseManager;

    private String selectedBloodGroup = "Any";
    private String selectedDistrict = "";
    private String selectedCity = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search_donor);

        firebaseManager = FirebaseManager.getInstance();

        initViews();
        setupDropdowns();
        setupRecyclerView();
        setupListeners();
        performSearch();
    }

    private void initViews() {
        toolbar = findViewById(R.id.toolbar_search);
        toolbar.setNavigationOnClickListener(v -> finish());

        actvSearchBloodGroup = findViewById(R.id.actv_search_blood_group);
        actvSearchDistrict = findViewById(R.id.actv_search_district);
        actvSearchCity = findViewById(R.id.actv_search_city);
        etSearchArea = findViewById(R.id.et_search_area);
        btnSearchSubmit = findViewById(R.id.btn_search_submit);

        layoutResultsHeader = findViewById(R.id.layout_results_header);
        layoutLoading = findViewById(R.id.layout_loading);
        layoutEmptyState = findViewById(R.id.layout_empty_state);
        tvResultsCount = findViewById(R.id.tv_results_count);
        rvDonors = findViewById(R.id.rv_donors);
    }

    private void setupDropdowns() {
        String[] searchBGs = LocationHelper.getSearchBloodGroups();
        ArrayAdapter<String> bgAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, searchBGs);
        actvSearchBloodGroup.setAdapter(bgAdapter);
        actvSearchBloodGroup.setText(searchBGs[0], false);
        actvSearchBloodGroup.setOnItemClickListener((parent, view, position, id) -> selectedBloodGroup = searchBGs[position]);

        List<String> districts = new ArrayList<>();
        districts.add("All Districts");
        districts.addAll(LocationHelper.getDistricts(this));

        ArrayAdapter<String> districtAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, districts);
        actvSearchDistrict.setAdapter(districtAdapter);
        actvSearchDistrict.setText(districts.get(0), false);

        actvSearchDistrict.setOnItemClickListener((parent, view, position, id) -> {
            String choice = districts.get(position);
            if (choice.equals("All Districts")) {
                selectedDistrict = "";
                actvSearchCity.setText("All Cities", false);
                actvSearchCity.setAdapter(new ArrayAdapter<>(SearchDonorActivity.this, android.R.layout.simple_dropdown_item_1line, new String[]{"All Cities"}));
                selectedCity = "";
            } else {
                selectedDistrict = choice;
                List<String> cities = new ArrayList<>();
                cities.add("All Cities");
                cities.addAll(LocationHelper.getCitiesForDistrict(SearchDonorActivity.this, selectedDistrict));

                ArrayAdapter<String> cityAdapter = new ArrayAdapter<>(SearchDonorActivity.this, android.R.layout.simple_dropdown_item_1line, cities);
                actvSearchCity.setAdapter(cityAdapter);
                actvSearchCity.setText("All Cities", false);
                selectedCity = "";
            }
        });

        actvSearchCity.setOnItemClickListener((parent, view, position, id) -> {
            String choice = (String) parent.getItemAtPosition(position);
            selectedCity = choice.equals("All Cities") ? "" : choice;
        });
    }

    private void setupRecyclerView() {
        rvDonors.setLayoutManager(new LinearLayoutManager(this));
        donorAdapter = new DonorAdapter(this);
        rvDonors.setAdapter(donorAdapter);
    }

    private void setupListeners() {
        btnSearchSubmit.setOnClickListener(v -> performSearch());
    }

    private void performSearch() {
        String areaKeyword = etSearchArea.getText() != null ? etSearchArea.getText().toString().trim().toLowerCase() : "";

        layoutLoading.setVisibility(View.VISIBLE);
        layoutEmptyState.setVisibility(View.GONE);
        layoutResultsHeader.setVisibility(View.GONE);
        rvDonors.setVisibility(View.GONE);

        Query query = firebaseManager.buildSearchQuery(selectedBloodGroup, selectedDistrict, selectedCity);

        query.get()
                .addOnSuccessListener(queryDocumentSnapshots -> {
                    layoutLoading.setVisibility(View.GONE);
                    List<Donor> results = new ArrayList<>();

                    for (DocumentSnapshot doc : queryDocumentSnapshots.getDocuments()) {
                        Donor donor = doc.toObject(Donor.class);
                        if (donor != null) {
                            donor.setId(doc.getId());
                            if (!areaKeyword.isEmpty()) {
                                String dArea = donor.getArea() != null ? donor.getArea().toLowerCase() : "";
                                String dCity = donor.getCity() != null ? donor.getCity().toLowerCase() : "";
                                if (!dArea.contains(areaKeyword) && !dCity.contains(areaKeyword)) {
                                    continue;
                                }
                            }
                            results.add(donor);
                        }
                    }

                    if (results.isEmpty()) {
                        layoutEmptyState.setVisibility(View.VISIBLE);
                        layoutResultsHeader.setVisibility(View.GONE);
                        rvDonors.setVisibility(View.GONE);
                    } else {
                        layoutEmptyState.setVisibility(View.GONE);
                        layoutResultsHeader.setVisibility(View.VISIBLE);
                        tvResultsCount.setText(results.size() + (results.size() == 1 ? " Donor Found" : " Donors Found"));
                        donorAdapter.setDonors(results);
                        rvDonors.setVisibility(View.VISIBLE);
                    }
                })
                .addOnFailureListener(e -> {
                    layoutLoading.setVisibility(View.GONE);
                    layoutEmptyState.setVisibility(View.VISIBLE);
                    Toast.makeText(SearchDonorActivity.this, "Search error: " + e.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
                });
    }
}`
  },
  {
    path: 'android_project/app/src/main/java/com/blooddonorpakistan/app/adapter/DonorAdapter.java',
    name: 'DonorAdapter.java',
    type: 'java',
    content: `package com.blooddonorpakistan.app.adapter;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.blooddonorpakistan.app.R;
import com.blooddonorpakistan.app.model.Donor;
import com.google.android.material.button.MaterialButton;
import java.util.ArrayList;
import java.util.List;

public class DonorAdapter extends RecyclerView.Adapter<DonorAdapter.DonorViewHolder> {

    private final Context context;
    private final List<Donor> donorList = new ArrayList<>();

    public DonorAdapter(Context context) {
        this.context = context;
    }

    public void setDonors(List<Donor> newDonors) {
        this.donorList.clear();
        if (newDonors != null) {
            this.donorList.addAll(newDonors);
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public DonorViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_donor_card, parent, false);
        return new DonorViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull DonorViewHolder holder, int position) {
        Donor donor = donorList.get(position);
        holder.bind(donor);
    }

    @Override
    public int getItemCount() {
        return donorList.size();
    }

    class DonorViewHolder extends RecyclerView.ViewHolder {
        private final TextView tvName, tvAge, tvBloodGroup, tvLocation, tvArea;
        private final MaterialButton btnCallDonor;

        public DonorViewHolder(@NonNull View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tv_donor_name);
            tvAge = itemView.findViewById(R.id.tv_donor_age);
            tvBloodGroup = itemView.findViewById(R.id.tv_donor_blood_group);
            tvLocation = itemView.findViewById(R.id.tv_donor_location);
            tvArea = itemView.findViewById(R.id.tv_donor_area);
            btnCallDonor = itemView.findViewById(R.id.btn_call_donor);
        }

        public void bind(final Donor donor) {
            tvName.setText(donor.getName());
            tvAge.setText(String.format("Age: %d years", donor.getAge()));
            tvBloodGroup.setText(donor.getBloodGroup());
            tvLocation.setText(donor.getCity() + ", " + donor.getDistrict());

            if (donor.getArea() != null && !donor.getArea().trim().isEmpty()) {
                tvArea.setVisibility(View.VISIBLE);
                tvArea.setText("Area: " + donor.getArea().trim());
            } else {
                tvArea.setVisibility(View.GONE);
            }

            btnCallDonor.setOnClickListener(v -> {
                String phone = donor.getPhone();
                if (phone != null && !phone.trim().isEmpty()) {
                    try {
                        Intent dialIntent = new Intent(Intent.ACTION_DIAL);
                        dialIntent.setData(Uri.parse("tel:" + phone.trim()));
                        context.startActivity(dialIntent);
                    } catch (Exception e) {
                        Toast.makeText(context, "Unable to open dialer", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }
    }
}`
  },
  {
    path: 'android_project/app/build.gradle',
    name: 'app/build.gradle',
    type: 'gradle',
    content: `plugins {
    id 'com.android.application'
    id 'com.google.gms.google-services'
}

android {
    namespace 'com.blooddonorpakistan.app'
    compileSdk 34

    defaultConfig {
        applicationId "com.blooddonorpakistan.app"
        minSdk 23
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    buildFeatures {
        viewBinding true
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.cardview:cardview:1.0.0'
    implementation 'androidx.recyclerview:recyclerview:1.3.2'

    // Firebase BoM & Services
    implementation platform('com.google.firebase:firebase-bom:32.7.2')
    implementation 'com.google.firebase:firebase-analytics'
    implementation 'com.google.firebase:firebase-auth'
    implementation 'com.google.firebase:firebase-firestore'
}`
  },
  {
    path: 'firestore.rules',
    name: 'firestore.rules',
    type: 'rules',
    content: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function validBloodGroup(bg) {
      return bg in ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    }

    function isValidDonor(data) {
      return data.name is string && data.name.size() > 0 && data.name.size() <= 80
        && data.phone is string && data.phone.size() >= 10 && data.phone.size() <= 15
        && data.age is int && data.age >= 18 && data.age <= 65
        && validBloodGroup(data.bloodGroup)
        && data.district is string && data.district.size() > 0
        && data.city is string && data.city.size() > 0
        && data.available is bool;
    }

    match /donors/{donorId} {
      allow read: if true;
      allow create: if isOwner(donorId) && isValidDonor(request.resource.data);
      allow update: if isOwner(donorId) && isValidDonor(request.resource.data);
      allow delete: if isOwner(donorId);
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}`
  },
  {
    path: '.github/workflows/android.yml',
    name: 'android.yml (GitHub Actions CI/CD)',
    type: 'gradle',
    content: `name: Android APK Build

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    name: Build Android Debug APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: Grant Execute Permission for Gradle Wrapper
        run: |
          if [ -f "gradlew" ]; then
            chmod +x gradlew
          fi
          if [ -f "android_project/gradlew" ]; then
            chmod +x android_project/gradlew
          fi

      - name: Build Debug APK
        run: |
          if [ -f "./gradlew" ]; then
            ./gradlew assembleDebug --stacktrace
          elif [ -f "android_project/gradlew" ]; then
            cd android_project && ./gradlew assembleDebug --stacktrace
          elif [ -f "build.gradle" ]; then
            gradle assembleDebug --stacktrace
          elif [ -f "android_project/build.gradle" ]; then
            cd android_project && gradle assembleDebug --stacktrace
          fi

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: debug-apk
          path: |
            app/build/outputs/apk/debug/*.apk
            android_project/app/build/outputs/apk/debug/*.apk
          if-no-files-found: warn`
  },
  {
    path: 'android_project/gradlew',
    name: 'gradlew (Gradle Wrapper Executable)',
    type: 'gradle',
    content: `#!/bin/sh
# Gradle Wrapper Executable Script for Linux & macOS
# Automatically bootstraps Gradle 8.5 and compiles APK

app_path=$0
while [ -h "$app_path" ]; do
    ls=\`ls -ld "$app_path"\`
    link=\`expr "$ls" : '.*-> \\(.*\\)$'\`
    if expr "$link" : '/.*' > /dev/null; then
        app_path="$link"
    else
        app_path=\`dirname "$app_path"\`"/$link"
    fi
done

APP_BASE_NAME=\`basename "$0"\`
APP_HOME=\`cd "\\\`dirname \\"$app_path\\"\\\`" >/dev/null && pwd\`

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar

if [ ! -r "$CLASSPATH" ]; then
    mkdir -p "$APP_HOME/gradle/wrapper"
    echo "Downloading gradle-wrapper.jar..."
    curl -sSL -o "$CLASSPATH" https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar || true
fi

JAVACMD=java
if [ -n "$JAVA_HOME" ] ; then
    JAVACMD="$JAVA_HOME/bin/java"
fi

exec "$JAVACMD" "-Dorg.gradle.appname=$APP_BASE_NAME" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"`
  },
  {
    path: 'android_project/gradle/wrapper/gradle-wrapper.properties',
    name: 'gradle-wrapper.properties',
    type: 'gradle',
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.5-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`
  },
  {
    path: 'android_project/gradlew.bat',
    name: 'gradlew.bat (Windows Wrapper)',
    type: 'gradle',
    content: `@if "%DEBUG%"=="" @echo off
@rem Gradle startup script for Windows
set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

set CLASSPATH=%APP_HOME%\\gradle\\wrapper\\gradle-wrapper.jar
java -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*`
  },
  {
    path: 'android_project/.gitignore',
    name: '.gitignore (Android)',
    type: 'gradle',
    content: `*.iml
.gradle
/local.properties
/.idea/
.DS_Store
/build
local.properties
app/build/
*.apk
*.aab`
  }
];
