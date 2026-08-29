package com.blooddonorpakistan.app.utils;

import android.content.Context;
import com.blooddonorpakistan.app.model.PunjabLocation;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Utility for loading and querying Punjab district and cascading city datasets.
 */
public class LocationHelper {

    private static final Map<String, List<String>> districtCityMap = new HashMap<>();
    private static final List<String> districtList = new ArrayList<>();
    private static boolean isInitialized = false;

    public static synchronized void init(Context context) {
        if (isInitialized && !districtList.isEmpty()) {
            return;
        }

        try {
            InputStream is = context.getAssets().open("punjab_locations.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();

            String json = new String(buffer, StandardCharsets.UTF_8);
            JSONObject root = new JSONObject(json);
            JSONArray districtsArray = root.getJSONArray("districts");

            districtCityMap.clear();
            districtList.clear();

            for (int i = 0; i < districtsArray.length(); i++) {
                JSONObject districtObj = districtsArray.getJSONObject(i);
                String districtName = districtObj.getString("name");
                JSONArray citiesArray = districtObj.getJSONArray("cities");

                List<String> cities = new ArrayList<>();
                for (int j = 0; j < citiesArray.length(); j++) {
                    cities.add(citiesArray.getString(j));
                }

                districtList.add(districtName);
                districtCityMap.put(districtName, cities);
            }

            Collections.sort(districtList);
            isInitialized = true;
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback default if asset load fails
            loadFallbackDistricts();
        }
    }

    private static void loadFallbackDistricts() {
        districtList.clear();
        String[] fallbackDistricts = {
            "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala",
            "Sialkot", "Bahawalpur", "Sargodha", "Sahiwal", "Gujrat",
            "Sheikhupura", "Jhang", "Rahim Yar Khan", "Kasur", "Muzaffargarh"
        };
        for (String d : fallbackDistricts) {
            districtList.add(d);
            List<String> cities = new ArrayList<>();
            cities.add(d + " City");
            districtCityMap.put(d, cities);
        }
        isInitialized = true;
    }

    public static List<String> getDistricts(Context context) {
        if (!isInitialized) {
            init(context);
        }
        return new ArrayList<>(districtList);
    }

    public static List<String> getCitiesForDistrict(Context context, String districtName) {
        if (!isInitialized) {
            init(context);
        }
        List<String> cities = districtCityMap.get(districtName);
        if (cities != null) {
            return new ArrayList<>(cities);
        }
        return new ArrayList<>();
    }

    public static String[] getBloodGroups() {
        return new String[]{"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
    }

    public static String[] getSearchBloodGroups() {
        return new String[]{"Any", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
    }
}
