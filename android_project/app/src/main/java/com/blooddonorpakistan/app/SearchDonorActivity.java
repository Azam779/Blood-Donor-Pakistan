package com.blooddonorpakistan.app;

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

        // Perform initial search to show active donors
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
        // Blood Groups
        String[] searchBGs = LocationHelper.getSearchBloodGroups();
        ArrayAdapter<String> bgAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, searchBGs);
        actvSearchBloodGroup.setAdapter(bgAdapter);
        actvSearchBloodGroup.setText(searchBGs[0], false);
        actvSearchBloodGroup.setOnItemClickListener((parent, view, position, id) -> selectedBloodGroup = searchBGs[position]);

        // Districts (Punjab)
        List<String> districts = new ArrayList<>();
        districts.add("All Districts");
        districts.addAll(LocationHelper.getDistricts(this));

        ArrayAdapter<String> districtAdapter = new ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line, districts);
        actvSearchDistrict.setAdapter(districtAdapter);
        actvSearchDistrict.setText(districts.get(0), false);

        // Cascading Dropdown for Search: District -> City
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
            if (choice.equals("All Cities")) {
                selectedCity = "";
            } else {
                selectedCity = choice;
            }
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

        // UI State: Loading
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

                            // Area filter if specified
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
}
