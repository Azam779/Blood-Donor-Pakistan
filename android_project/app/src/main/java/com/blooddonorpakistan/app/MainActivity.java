package com.blooddonorpakistan.app;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.widget.Toast;
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
}
