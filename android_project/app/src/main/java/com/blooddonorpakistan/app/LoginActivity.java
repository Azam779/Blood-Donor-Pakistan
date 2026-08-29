package com.blooddonorpakistan.app;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.blooddonorpakistan.app.utils.FirebaseManager;
import com.blooddonorpakistan.app.utils.ValidationUtils;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.FirebaseException;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.PhoneAuthCredential;
import com.google.firebase.auth.PhoneAuthOptions;
import com.google.firebase.auth.PhoneAuthProvider;
import java.util.concurrent.TimeUnit;

public class LoginActivity extends AppCompatActivity {

    private TextInputLayout tilPhone;
    private TextInputEditText etPhone;
    private MaterialButton btnSendOtp;
    private ProgressBar pbLoading;
    private MaterialToolbar toolbar;

    private FirebaseManager firebaseManager;
    private String targetScreen = "donate";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        firebaseManager = FirebaseManager.getInstance();

        if (getIntent().hasExtra("target_screen")) {
            targetScreen = getIntent().getStringExtra("target_screen");
        }

        initViews();
        setupListeners();
    }

    private void initViews() {
        toolbar = findViewById(R.id.toolbar_login);
        toolbar.setNavigationOnClickListener(v -> finish());

        tilPhone = findViewById(R.id.til_auth_phone);
        etPhone = findViewById(R.id.et_auth_phone);
        btnSendOtp = findViewById(R.id.btn_send_otp);
        pbLoading = findViewById(R.id.pb_auth_loading);
    }

    private void setupListeners() {
        btnSendOtp.setOnClickListener(v -> sendVerificationCode());
    }

    private void sendVerificationCode() {
        tilPhone.setError(null);
        String phone = etPhone.getText() != null ? etPhone.getText().toString().trim() : "";

        if (!ValidationUtils.isValidPhone(phone)) {
            tilPhone.setError("Please enter a valid 10/11-digit mobile number (e.g. 03001234567)");
            return;
        }

        String formattedPhone = ValidationUtils.formatPakistaniPhoneForAuth(phone);
        setLoading(true);

        PhoneAuthOptions options = PhoneAuthOptions.newBuilder(firebaseManager.getAuth())
                .setPhoneNumber(formattedPhone)
                .setTimeout(60L, TimeUnit.SECONDS)
                .setActivity(this)
                .setCallbacks(new PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
                    @Override
                    public void onVerificationCompleted(@NonNull PhoneAuthCredential credential) {
                        setLoading(false);
                        signInWithCredential(credential);
                    }

                    @Override
                    public void onVerificationFailed(@NonNull FirebaseException e) {
                        setLoading(false);
                        Toast.makeText(LoginActivity.this, "SMS verification error: " + e.getLocalizedMessage() + "\n(Ensure Phone Auth & SHA-1 are enabled in Firebase Console)", Toast.LENGTH_LONG).show();
                    }

                    @Override
                    public void onCodeSent(@NonNull String verificationId, @NonNull PhoneAuthProvider.ForceResendingToken token) {
                        setLoading(false);
                        Intent intent = new Intent(LoginActivity.this, OtpVerifyActivity.class);
                        intent.putExtra("verification_id", verificationId);
                        intent.putExtra("phone_number", formattedPhone);
                        intent.putExtra("target_screen", targetScreen);
                        startActivity(intent);
                        finish();
                    }
                })
                .build();

        PhoneAuthProvider.verifyPhoneNumber(options);
    }

    private void signInWithCredential(PhoneAuthCredential credential) {
        firebaseManager.getAuth().signInWithCredential(credential)
                .addOnSuccessListener(authResult -> {
                    Toast.makeText(LoginActivity.this, "Phone verified successfully!", Toast.LENGTH_SHORT).show();
                    navigateNext();
                })
                .addOnFailureListener(e -> Toast.makeText(LoginActivity.this, "Authentication failed: " + e.getLocalizedMessage(), Toast.LENGTH_LONG).show());
    }

    private void navigateNext() {
        Intent nextIntent;
        if ("profile".equals(targetScreen)) {
            nextIntent = new Intent(LoginActivity.this, DonorProfileActivity.class);
        } else {
            nextIntent = new Intent(LoginActivity.this, DonateActivity.class);
        }
        startActivity(nextIntent);
        finish();
    }

    private void setLoading(boolean loading) {
        btnSendOtp.setVisibility(loading ? View.INVISIBLE : View.VISIBLE);
        pbLoading.setVisibility(loading ? View.VISIBLE : View.GONE);
        btnSendOtp.setEnabled(!loading);
    }
}
