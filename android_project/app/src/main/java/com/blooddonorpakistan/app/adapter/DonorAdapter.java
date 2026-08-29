package com.blooddonorpakistan.app.adapter;

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

        private final TextView tvName;
        private final TextView tvAge;
        private final TextView tvBloodGroup;
        private final TextView tvLocation;
        private final TextView tvArea;
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

            // General location: City, District
            String loc = donor.getCity() + ", " + donor.getDistrict();
            tvLocation.setText(loc);

            // Optional Area
            if (donor.getArea() != null && !donor.getArea().trim().isEmpty()) {
                tvArea.setVisibility(View.VISIBLE);
                tvArea.setText("Area: " + donor.getArea().trim());
            } else {
                tvArea.setVisibility(View.GONE);
            }

            // CALL DONOR button - Launches Android ACTION_DIAL
            btnCallDonor.setOnClickListener(v -> {
                String phone = donor.getPhone();
                if (phone != null && !phone.trim().isEmpty()) {
                    try {
                        Intent dialIntent = new Intent(Intent.ACTION_DIAL);
                        dialIntent.setData(Uri.parse("tel:" + phone.trim()));
                        context.startActivity(dialIntent);
                    } catch (Exception e) {
                        Toast.makeText(context, "Unable to open phone dialer.", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(context, "Phone number is not available.", Toast.LENGTH_SHORT).show();
                }
            });
        }
    }
}
