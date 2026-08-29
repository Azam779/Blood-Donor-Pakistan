package com.blooddonorpakistan.app;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.blooddonorpakistan.app.utils.FirebaseManager;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.auth.FirebaseAuthInvalidCredentialsException;
import com.google.firebase.auth.PhoneAuthCredential;
import com.google.firebase.auth.PhoneAuthProvider;

public class OtpVerifyActivity extends AppCompatActivity {

    private TextInputLayout tilOtp;
    private TextInputEditText etOtp;
    private MaterialButton btnVerifyOtp;
    private ProgressBar pbLoading;
    private TextView tvPhoneTarget;
    private MaterialToolbar toolbar;

    private String verificationId;
    private String phoneNumber;
    private String targetScreen = "donate";
    private FirebaseManager firebaseManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_otp_verify);

        firebaseManager = FirebaseManager.getInstance();

        verificationId = getIntent().getStringExtra("verification_id");
        phoneNumber = getIntent().getStringExtra("phone_number");
        if (getIntent().hasExtra("target_screen")) {
            targetScreen = getIntent().getStringExtra("target_screen");
        }

        initViews();
        setupListeners();
    }

    private void initViews() {
        toolbar = findViewById(R.id.toolbar_otp);
        toolbar.setNavigationOnClickListener(v -> finish());

        tilOtp = findViewById(R.id.til_otp);
        etOtp = findViewById(R.id.et_otp);
        btnVerifyOtp = findViewById(R.id.btn_verify_otp);
        pbLoading = findViewById(R.id.pb_otp_loading);
        tvPhoneTarget = findViewById(R.id.tv_otp_phone_target);

        if (phoneNumber != null) {
            tvPhoneTarget.setText(String.format("Enter the 6-digit SMS verification code sent to %s", phoneNumber));
        }
    }

    private void setupListeners() {
        btnVerifyOtp.setOnClickListener(v -> verifyOtp());
    }

    private void verifyOtp() {
        tilOtp.setError(null);
        String code = etOtp.getText() != null ? etOtp.getText().toString().trim() : "";

        if (TextUtils.isEmpty(code) || code.length() < 6) {
            tilOtp.setError("Please enter the complete 6-digit SMS code");
            return;
        }

        if (verificationId == null) {
            Toast.makeText(this, "Verification session expired. Please request code again.", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        setLoading(true);
        PhoneAuthCredential credential = PhoneAuthProvider.getCredential(verificationId, code);

        firebaseManager.getAuth().signInWithCredential(credential)
                .addOnSuccessListener(authResult -> {
                    setLoading(false);
                    Toast.makeText(OtpVerifyActivity.this, "Phone verified successfully!", Toast.LENGTH_SHORT).show();
                    navigateNext();
                })
                .addOnFailureListener(e -> {
                    setLoading(false);
                    if (e instanceof FirebaseAuthInvalidCredentialsException) {
                        tilOtp.setError("The SMS verification code entered is invalid.");
                    } else {
                        Toast.makeText(OtpVerifyActivity.this, "Verification failed: " + e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
                    }
                });
    }

    private void navigateNext() {
        Intent nextIntent;
        if ("profile".equals(targetScreen)) {
            nextIntent = new Intent(OtpVerifyActivity.this, DonorProfileActivity.class);
        } else {
            nextIntent = new Intent(OtpVerifyActivity.this, DonateActivity.class);
        }
        startActivity(nextIntent);
        finish();
    }

    private void setLoading(boolean loading) {
        btnVerifyOtp.setVisibility(loading ? View.INVISIBLE : View.VISIBLE);
        pbLoading.setVisibility(loading ? View.VISIBLE : View.GONE);
        btnVerifyOtp.setEnabled(!loading);
    }
}
