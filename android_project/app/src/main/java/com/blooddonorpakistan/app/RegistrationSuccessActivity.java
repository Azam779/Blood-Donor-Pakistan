package com.blooddonorpakistan.app;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.blooddonorpakistan.app.model.Donor;
import com.google.android.material.button.MaterialButton;

public class RegistrationSuccessActivity extends AppCompatActivity {

    private TextView tvSummaryName;
    private TextView tvSummaryDetails;
    private MaterialButton btnBackHome;
    private MaterialButton btnViewProfile;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registration_success);

        tvSummaryName = findViewById(R.id.tv_summary_name);
        tvSummaryDetails = findViewById(R.id.tv_summary_details);
        btnBackHome = findViewById(R.id.btn_back_home);
        btnViewProfile = findViewById(R.id.btn_view_profile);

        Donor donor = (Donor) getIntent().getSerializableExtra("donor");
        if (donor != null) {
            tvSummaryName.setText(donor.getName());
            String details = "Blood Group: " + donor.getBloodGroup() + " • " + donor.getCity() + ", " + donor.getDistrict();
            tvSummaryDetails.setText(details);
        }

        btnBackHome.setOnClickListener(v -> {
            Intent intent = new Intent(RegistrationSuccessActivity.this, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            finish();
        });

        btnViewProfile.setOnClickListener(v -> {
            Intent intent = new Intent(RegistrationSuccessActivity.this, DonorProfileActivity.class);
            startActivity(intent);
            finish();
        });
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        Intent intent = new Intent(RegistrationSuccessActivity.this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        finish();
    }
}
