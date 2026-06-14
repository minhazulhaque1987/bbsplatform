/* ═══════════════════════════════════════════════════════════════
   PHC 2022 — জনশুমারি ও গৃহগণনা ২০২২
   কক্সবাজার কমিউনিটি রিপোর্ট ডেটাবেইজ
   Source: Bangladesh Bureau of Statistics (BBS), May 2025
   Updated from: Cox's Bazar.pdf and Cox's Bazar.xlsx
   ═══════════════════════════════════════════════════════════════ */

var PHC_META = {
  title_bn: "জনশুমারি ও গৃহগণনা ২০২২",
  title_en: "Population and Housing Census 2022",
  report_bn: "কমিউনিটি রিপোর্ট: কক্সবাজার",
  report_en: "Community Report: Cox's Bazar",
  source: "বাংলাদেশ পরিসংখ্যান ব্যুরো (বিবিএস)",
  published: "মে ২০২৫",
  isbn: "978-984-475-342-6"
};

var PHC_DISTRICT = {
  name_en: "Cox's Bazar", name_bn: "কক্সবাজার",
  pop_total_2022: 2823268, pop_male_2022: 1434622, pop_female_2022: 1388563, pop_hijra_2022: 83,
  pop_rural_2022: 1591629, pop_urban_2022: 1231639,
  pop_total_2011: 2289990,
  area_sq_km: 2491.85,
  pop_density_2022: 1133, pop_density_2011: 919,
  growth_rate_2022: 1.86, growth_rate_2011: 2.55,
  urban_pct_2022: 43.62, urban_pct_2011: 21.79,
  sex_ratio_2022: 103.32, sex_ratio_rural_2022: 101.06, sex_ratio_urban_2022: 106.31, sex_ratio_2011: 104,
  literacy_total_2022: 71.58, literacy_male_2022: 72.51, literacy_female_2022: 70.62, literacy_2011: 39.29,
  literacy_rural_2022: 69.76, literacy_urban_2022: 73.91,
  hh_total_2022: 587114, hh_rural_2022: 328765, hh_urban_2022: 258349, hh_total_2011: 415954,
  hh_size_2022: 4.75, hh_size_2011: 5.45,
  hh_general_2022: 576730, hh_institutional_2022: 765,
  dwelling_units_2022: 480480,
  dwelling_pucca_pct: 15.01, dwelling_semipucca_pct: 18.55, dwelling_kancha_pct: 58.45, dwelling_jhupri_pct: 7.99,
  dwelling_pucca_pct_2011: 6.15,
  own_dwelling_pct: 88.88, rented_own_elsewhere_pct: 5.52, rented_no_own_pct: 1.34,
  rentfree_own_elsewhere_pct: 0.60, rentfree_no_own_pct: 3.67,
  water_tap_pct: 0.61, water_tubewell_pct: 97.64, water_bottled_pct: 0.79,
  toilet_safe_flush_pct: 41.32, toilet_pit_slab_pct: 19.53, toilet_unsafe_pct: 20.79, toilet_open_defecation_pct: 1.99,
  electricity_grid_pct: 88.96, electricity_solar_pct: 7.01, electricity_none_pct: 3.40,
  electricity_none_pct_2011: 67.93,
  neet_total_pct: 35.76, neet_male_pct: 13.22, neet_female_pct: 57.10,
  mobile_phone_pct: 66.59, mobile_phone_male_pct: 80.79, mobile_phone_female_pct: 52.12,
  internet_pct: 37.42, internet_male_pct: 48.83, internet_female_pct: 25.80,
  financial_account_pct: 22.40, financial_account_male_pct: 28.30, financial_account_female_pct: 16.39,
  mobile_banking_pct: 33.69, mobile_banking_male_pct: 45.62, mobile_banking_female_pct: 21.53,
  toilet_not_shared_pct: 73.31, handwashing_soap_water_pct: 47.65,
  cooking_fuel_wood_pct: 56.91, cooking_fuel_lpgas_pct: 32.71,
  floor_cement_pct: 38.50, floor_soil_pct: 54.69,
  wall_cement_pct: 38.06, wall_cisheet_pct: 13.90, wall_soil_pct: 25.99,
  roof_cement_pct: 15.99, roof_cisheet_pct: 68.64,
  pop_muslim: 2669977, pop_hindu: 108166, pop_buddhist: 42305, pop_christian: 2006, pop_others: 814,
  upazila_count: 9, paurashava_count: 4, union_count: 79, village_count: 1180
};

var PHC_UPAZILAS = [
  {
    id:1, code:"1601", name_en:"Chakaria", name_bn:"চকরিয়া"
    ,unions:20, villages:335, mahalla:24, area_sq_km:503.83
    ,pop_total_2022:571280, pop_male_2022:284348, pop_female_2022:286926, pop_hijra_2022:6
    ,pop_rural_2022:389677, pop_urban_2022:181603
    ,pop_total_2011:null, pop_total_2001:null
    ,urban_pct_2022:31.79, urban_pct_2011:null, urban_pct_2001:null
    ,pop_density_2022:1133, pop_density_2011:null, pop_density_2001:null
    ,growth_rate_2022:null, growth_rate_2011:null, growth_rate_2001:null
    ,sex_ratio_2022:99.1, sex_ratio_rural_2022:106.9, sex_ratio_urban_2022:98.3
    ,sex_ratio_2011:null, sex_ratio_2001:null
    ,pop_muslim:537024, pop_hindu:28755, pop_buddhist:4120, pop_christian:1307, pop_others:74
    ,literacy_total_2022:76.38, literacy_male_2022:47.61, literacy_female_2022:32.03
    ,literacy_rural_2022:null, literacy_urban_2022:null, literacy_2011:null, literacy_2001:null
    ,hh_total_2022:118086, hh_rural_2022:88391, hh_urban_2022:84434, hh_total_2011:null, hh_total_2001:null
    ,hh_general_2022:116478, hh_institutional_2022:142, dwelling_units_2022:97720
    ,hh_size_2022:4.79, hh_size_rural_2022:null, hh_size_urban_2022:null, hh_size_2011:null, hh_size_2001:null
    ,dwelling_pucca_pct:16.99, dwelling_semipucca_pct:6.51, dwelling_kancha_pct:2.87, dwelling_jhupri_pct:15.98
    ,own_dwelling_pct:null, rented_own_elsewhere_pct:null, rented_no_own_pct:null, rentfree_no_own_pct:null
    ,water_tap_pct:null, water_tubewell_pct:null, water_bottled_pct:null
    ,toilet_safe_flush_pct:null, toilet_pit_slab_pct:null, toilet_unsafe_pct:null, toilet_open_defecation_pct:null
    ,electricity_grid_pct:null, electricity_solar_pct:null, electricity_others_pct:null, electricity_none_pct:null
    ,neet_total_pct:35.98, neet_male_pct:13.43, neet_female_pct:56.05
    ,neet_rural_pct:null, neet_urban_pct:null
    ,mobile_phone_pct:66.5, mobile_phone_male_pct:79.81, mobile_phone_female_pct:53.68
    ,mobile_phone_rural_pct:null, mobile_phone_urban_pct:null
    ,internet_pct:36.67, internet_male_pct:46.49, internet_female_pct:27.21
    ,internet_rural_pct:null, internet_urban_pct:null
    ,financial_account_pct:23.68, financial_account_male_pct:28.75, financial_account_female_pct:18.79
    ,mobile_banking_pct:29.84, mobile_banking_male_pct:40.41, mobile_banking_female_pct:19.66
    ,sdg_learning:null, sdg_mobile:49.6, sdg_sanitation:null, sdg_handwashing:null
    ,sdg_electricity:null, sdg_clean_fuel:null, sdg_neet:35.98, sdg_financial:null, sdg_internet:28.62
  },
  {
    id:2, code:"1602", name_en:"Cox's Bazar Sadar", name_bn:"কক্সবাজার সদর"
    ,unions:5, villages:83, mahalla:99, area_sq_km:130.94
    ,pop_total_2022:417365, pop_male_2022:217167, pop_female_2022:200187, pop_hijra_2022:11
    ,pop_rural_2022:86010, pop_urban_2022:331355
    ,pop_total_2011:459082, pop_total_2001:348075
    ,urban_pct_2022:79.39, urban_pct_2011:null, urban_pct_2001:null
    ,pop_density_2022:3187, pop_density_2011:null, pop_density_2001:null
    ,growth_rate_2022:null, growth_rate_2011:null, growth_rate_2001:null
    ,sex_ratio_2022:108.48, sex_ratio_rural_2022:114.9, sex_ratio_urban_2022:97.27
    ,sex_ratio_2011:null, sex_ratio_2001:null
    ,pop_muslim:383726, pop_hindu:25987, pop_buddhist:7094, pop_christian:393, pop_others:165
    ,literacy_total_2022:77.59, literacy_male_2022:49.22, literacy_female_2022:39.7
    ,literacy_rural_2022:null, literacy_urban_2022:null, literacy_2011:null, literacy_2001:null
    ,hh_total_2022:90680, hh_rural_2022:82683, hh_urban_2022:58350, hh_total_2011:null, hh_total_2001:null
    ,hh_general_2022:85516, hh_institutional_2022:163, dwelling_units_2022:61041
    ,hh_size_2022:4.55, hh_size_rural_2022:null, hh_size_urban_2022:null, hh_size_2011:null, hh_size_2001:null
    ,dwelling_pucca_pct:26.82, dwelling_semipucca_pct:11.85, dwelling_kancha_pct:7.77, dwelling_jhupri_pct:28.13
    ,own_dwelling_pct:null, rented_own_elsewhere_pct:null, rented_no_own_pct:null, rentfree_no_own_pct:null
    ,water_tap_pct:null, water_tubewell_pct:null, water_bottled_pct:null
    ,toilet_safe_flush_pct:null, toilet_pit_slab_pct:null, toilet_unsafe_pct:null, toilet_open_defecation_pct:null
    ,electricity_grid_pct:null, electricity_solar_pct:null, electricity_others_pct:null, electricity_none_pct:null
    ,neet_total_pct:32.01, neet_male_pct:11.2, neet_female_pct:52.44
    ,neet_rural_pct:null, neet_urban_pct:null
    ,mobile_phone_pct:72.84, mobile_phone_male_pct:83.85, mobile_phone_female_pct:60.88
    ,mobile_phone_rural_pct:null, mobile_phone_urban_pct:null
    ,internet_pct:48.98, internet_male_pct:59.57, internet_female_pct:37.46
    ,internet_rural_pct:null, internet_urban_pct:null
    ,financial_account_pct:29.59, financial_account_male_pct:35.98, financial_account_female_pct:22.65
    ,mobile_banking_pct:40.96, mobile_banking_male_pct:54.11, mobile_banking_female_pct:26.66
    ,sdg_learning:null, sdg_mobile:55.77, sdg_sanitation:null, sdg_handwashing:null
    ,sdg_electricity:null, sdg_clean_fuel:null, sdg_neet:32.01, sdg_financial:null, sdg_internet:38.91
  },
  {
    id:3, code:"1603", name_en:"Eidgaon", name_bn:"ঈদগাঁও"
    ,note:"ঈদগাঁও ২০২১ সালে কক্সবাজার সদর উপজেলা বিভক্ত করে গঠিত হয়েছে।"
    ,unions:5, villages:71, mahalla:0, area_sq_km:97.29
    ,pop_total_2022:149566, pop_male_2022:74491, pop_female_2022:75074, pop_hijra_2022:1
    ,pop_rural_2022:82891, pop_urban_2022:66675
    ,pop_total_2011:null, pop_total_2001:null
    ,urban_pct_2022:44.58, urban_pct_2011:null, urban_pct_2001:null
    ,pop_density_2022:1537, pop_density_2011:null, pop_density_2001:null
    ,growth_rate_2022:null, growth_rate_2011:null, growth_rate_2001:null
    ,sex_ratio_2022:99.22, sex_ratio_rural_2022:97.3, sex_ratio_urban_2022:101.66
    ,sex_ratio_2011:null, sex_ratio_2001:null
    ,pop_muslim:143189, pop_hindu:6295, pop_buddhist:68, pop_christian:5, pop_others:9
    ,literacy_total_2022:76.09, literacy_male_2022:76.71, literacy_female_2022:75.48
    ,literacy_rural_2022:null, literacy_urban_2022:null, literacy_2011:null, literacy_2001:null
    ,hh_total_2022:31742, hh_rural_2022:17422, hh_urban_2022:14320, hh_total_2011:null, hh_total_2001:null
    ,hh_general_2022:31262, hh_institutional_2022:41, dwelling_units_2022:26131
    ,hh_size_2022:4.69, hh_size_rural_2022:null, hh_size_urban_2022:null, hh_size_2011:null, hh_size_2001:null
    ,dwelling_pucca_pct:20.41, dwelling_semipucca_pct:21.05, dwelling_kancha_pct:54.34, dwelling_jhupri_pct:4.19
    ,own_dwelling_pct:null, rented_own_elsewhere_pct:null, rented_no_own_pct:null, rentfree_no_own_pct:null
    ,water_tap_pct:null, water_tubewell_pct:null, water_bottled_pct:null
    ,toilet_safe_flush_pct:null, toilet_pit_slab_pct:null, toilet_unsafe_pct:null, toilet_open_defecation_pct:null
    ,electricity_grid_pct:null, electricity_solar_pct:null, electricity_others_pct:null, electricity_none_pct:null
    ,neet_total_pct:37.05, neet_male_pct:12.06, neet_female_pct:59.57
    ,neet_rural_pct:null, neet_urban_pct:null
    ,mobile_phone_pct:67.78, mobile_phone_male_pct:80.89, mobile_phone_female_pct:55.17
    ,mobile_phone_rural_pct:null, mobile_phone_urban_pct:null
    ,internet_pct:46.28, internet_male_pct:56.76, internet_female_pct:36.2
    ,internet_rural_pct:null, internet_urban_pct:null
    ,financial_account_pct:26.46, financial_account_male_pct:32.03, financial_account_female_pct:21.11
    ,mobile_banking_pct:29.62, mobile_banking_male_pct:40.89, mobile_banking_female_pct:18.78
    ,sdg_learning:null, sdg_mobile:50.76, sdg_sanitation:null, sdg_handwashing:null
    ,sdg_electricity:null, sdg_clean_fuel:null, sdg_neet:37.05, sdg_financial:null, sdg_internet:36.61
  },
  {
    id:4, code:"1604", name_en:"Kutubdia", name_bn:"কুতুবদিয়া"
    ,unions:6, villages:30, mahalla:0, area_sq_km:215.79
    ,pop_total_2022:143622, pop_male_2022:74528, pop_female_2022:69091, pop_hijra_2022:3
    ,pop_rural_2022:93151, pop_urban_2022:50471
    ,pop_total_2011:null, pop_total_2001:null
    ,urban_pct_2022:35.14, urban_pct_2011:null, urban_pct_2001:null
    ,pop_density_2022:665, pop_density_2011:null, pop_density_2001:null
    ,growth_rate_2022:null, growth_rate_2011:null, growth_rate_2001:null
    ,sex_ratio_2022:107.87, sex_ratio_rural_2022:108.7, sex_ratio_urban_2022:107.99
    ,sex_ratio_2011:null, sex_ratio_2001:null
    ,pop_muslim:136324, pop_hindu:7281, pop_buddhist:15, pop_christian:2, pop_others:0
    ,literacy_total_2022:70.37, literacy_male_2022:34.04, literacy_female_2022:28.39
    ,literacy_rural_2022:null, literacy_urban_2022:null, literacy_2011:null, literacy_2001:null
    ,hh_total_2022:28364, hh_rural_2022:22587, hh_urban_2022:18368, hh_total_2011:null, hh_total_2001:null
    ,hh_general_2022:28245, hh_institutional_2022:30, dwelling_units_2022:24207
    ,hh_size_2022:5.03, hh_size_rural_2022:null, hh_size_urban_2022:null, hh_size_2011:null, hh_size_2001:null
    ,dwelling_pucca_pct:6.05, dwelling_semipucca_pct:3.18, dwelling_kancha_pct:1.89, dwelling_jhupri_pct:6.25
    ,own_dwelling_pct:null, rented_own_elsewhere_pct:null, rented_no_own_pct:null, rentfree_no_own_pct:null
    ,water_tap_pct:null, water_tubewell_pct:null, water_bottled_pct:null
    ,toilet_safe_flush_pct:null, toilet_pit_slab_pct:null, toilet_unsafe_pct:null, toilet_open_defecation_pct:null
    ,electricity_grid_pct:null, electricity_solar_pct:null, electricity_others_pct:null, electricity_none_pct:null
    ,neet_total_pct:32.7, neet_male_pct:10.38, neet_female_pct:55.37
    ,neet_rural_pct:null, neet_urban_pct:null
    ,mobile_phone_pct:63.91, mobile_phone_male_pct:79.97, mobile_phone_female_pct:46.84
    ,mobile_phone_rural_pct:null, mobile_phone_urban_pct:null
    ,internet_pct:25.25, internet_male_pct:36.34, internet_female_pct:13.45
    ,internet_rural_pct:null, internet_urban_pct:null
    ,financial_account_pct:14.0, financial_account_male_pct:18.38, financial_account_female_pct:9.34
    ,mobile_banking_pct:37.48, mobile_banking_male_pct:49.83, mobile_banking_female_pct:24.34
    ,sdg_learning:null, sdg_mobile:48.09, sdg_sanitation:null, sdg_handwashing:null
    ,sdg_electricity:null, sdg_clean_fuel:null, sdg_neet:32.7, sdg_financial:null, sdg_internet:19.37
  },
  {
    id:5, code:"1605", name_en:"Maheshkhali", name_bn:"মহেশখালী"
    ,unions:9, villages:170, mahalla:28, area_sq_km:362.18
    ,pop_total_2022:385510, pop_male_2022:196635, pop_female_2022:188865, pop_hijra_2022:10
    ,pop_rural_2022:261591, pop_urban_2022:123919
    ,pop_total_2011:null, pop_total_2001:null
    ,urban_pct_2022:32.14, urban_pct_2011:null, urban_pct_2001:null
    ,pop_density_2022:1064, pop_density_2011:null, pop_density_2001:null
    ,growth_rate_2022:null, growth_rate_2011:null, growth_rate_2001:null
    ,sex_ratio_2022:104.11, sex_ratio_rural_2022:111.4, sex_ratio_urban_2022:103.91
    ,sex_ratio_2011:null, sex_ratio_2001:null
    ,pop_muslim:364670, pop_hindu:18183, pop_buddhist:2625, pop_christian:14, pop_others:18
    ,literacy_total_2022:63.85, literacy_male_2022:30.78, literacy_female_2022:22.54
    ,literacy_rural_2022:null, literacy_urban_2022:null, literacy_2011:null, literacy_2001:null
    ,hh_total_2022:80581, hh_rural_2022:58177, hh_urban_2022:43097, hh_total_2011:null, hh_total_2001:null
    ,hh_general_2022:80120, hh_institutional_2022:64, dwelling_units_2022:67653
    ,hh_size_2022:4.76, hh_size_rural_2022:null, hh_size_urban_2022:null, hh_size_2011:null, hh_size_2001:null
    ,dwelling_pucca_pct:8.12, dwelling_semipucca_pct:2.81, dwelling_kancha_pct:1.65, dwelling_jhupri_pct:13.63
    ,own_dwelling_pct:null, rented_own_elsewhere_pct:null, rented_no_own_pct:null, rentfree_no_own_pct:null
    ,water_tap_pct:null, water_tubewell_pct:null, water_bottled_pct:null
    ,toilet_safe_flush_pct:null, toilet_pit_slab_pct:null, toilet_unsafe_pct:null, toilet_open_defecation_pct:null
    ,electricity_grid_pct:null, electricity_solar_pct:null, electricity_others_pct:null, electricity_none_pct:null
    ,neet_total_pct:35.04, neet_male_pct:12.78, neet_female_pct:56.22
    ,neet_rural_pct:null, neet_urban_pct:null
    ,mobile_phone_pct:61.44, mobile_phone_male_pct:78.05, mobile_phone_female_pct:44.35
    ,mobile_phone_rural_pct:null, mobile_phone_urban_pct:null
    ,internet_pct:31.32, internet_male_pct:42.32, internet_female_pct:20.0
    ,internet_rural_pct:null, internet_urban_pct:null
    ,financial_account_pct:18.05, financial_account_male_pct:22.92, financial_account_female_pct:13.04
    ,mobile_banking_pct:29.42, mobile_banking_male_pct:39.8, mobile_banking_female_pct:18.74
    ,sdg_learning:null, sdg_mobile:45.49, sdg_sanitation:null, sdg_handwashing:null
    ,sdg_electricity:null, sdg_clean_fuel:null, sdg_neet:35.04, sdg_financial:null, sdg_internet:23.94
  },
  {
    id:6, code:"1606", name_en:"Pekua", name_bn:"পেকুয়া"
    ,unions:7, villages:125, mahalla:0, area_sq_km:139.61
    ,pop_total_2022:214357, pop_male_2022:106000, pop_female_2022:108349, pop_hijra_2022:8
    ,pop_rural_2022:121305, pop_urban_2022:93052
    ,pop_total_2011:null, pop_total_2001:null
    ,urban_pct_2022:43.41, urban_pct_2011:null, urban_pct_2001:null
    ,pop_density_2022:1535, pop_density_2011:null, pop_density_2001:null
    ,growth_rate_2022:null, growth_rate_2011:null, growth_rate_2001:null
    ,sex_ratio_2022:97.83, sex_ratio_rural_2022:98.37, sex_ratio_urban_2022:97.14
    ,sex_ratio_2011:null, sex_ratio_2001:null
    ,pop_muslim:211874, pop_hindu:1599, pop_buddhist:624, pop_christian:41, pop_others:219
    ,literacy_total_2022:70.62, literacy_male_2022:35.3, literacy_female_2022:71.07
    ,literacy_rural_2022:null, literacy_urban_2022:null, literacy_2011:null, literacy_2001:null
    ,hh_total_2022:45957, hh_rural_2022:31944, hh_urban_2022:25977, hh_total_2011:null, hh_total_2001:null
    ,hh_general_2022:45564, hh_institutional_2022:79, dwelling_units_2022:37862
    ,hh_size_2022:4.62, hh_size_rural_2022:null, hh_size_urban_2022:null, hh_size_2011:null, hh_size_2001:null
    ,dwelling_pucca_pct:12.0, dwelling_semipucca_pct:5.14, dwelling_kancha_pct:7.03, dwelling_jhupri_pct:5.63
    ,own_dwelling_pct:null, rented_own_elsewhere_pct:null, rented_no_own_pct:null, rentfree_no_own_pct:null
    ,water_tap_pct:null, water_tubewell_pct:null, water_bottled_pct:null
    ,toilet_safe_flush_pct:null, toilet_pit_slab_pct:null, toilet_unsafe_pct:null, toilet_open_defecation_pct:null
    ,electricity_grid_pct:null, electricity_solar_pct:null, electricity_others_pct:null, electricity_none_pct:null
    ,neet_total_pct:36.71, neet_male_pct:13.98, neet_female_pct:57.33
    ,neet_rural_pct:null, neet_urban_pct:null
    ,mobile_phone_pct:65.38, mobile_phone_male_pct:80.34, mobile_phone_female_pct:51.17
    ,mobile_phone_rural_pct:null, mobile_phone_urban_pct:null
    ,internet_pct:32.72, internet_male_pct:43.29, internet_female_pct:22.69
    ,internet_rural_pct:null, internet_urban_pct:null
    ,financial_account_pct:20.62, financial_account_male_pct:25.22, financial_account_female_pct:16.24
    ,mobile_banking_pct:35.52, mobile_banking_male_pct:47.12, mobile_banking_female_pct:24.51
    ,sdg_learning:null, sdg_mobile:48.23, sdg_sanitation:null, sdg_handwashing:null
    ,sdg_electricity:null, sdg_clean_fuel:null, sdg_neet:36.71, sdg_financial:null, sdg_internet:25.04
  },
  {
    id:7, code:"1607", name_en:"Ramu", name_bn:"রামু"
    ,unions:11, villages:101, mahalla:0, area_sq_km:391.71
    ,pop_total_2022:344545, pop_male_2022:179276, pop_female_2022:165265, pop_hijra_2022:4
    ,pop_rural_2022:236572, pop_urban_2022:107973
    ,pop_total_2011:null, pop_total_2001:null
    ,urban_pct_2022:31.34, urban_pct_2011:null, urban_pct_2001:null
    ,pop_density_2022:879, pop_density_2011:null, pop_density_2001:null
    ,growth_rate_2022:null, growth_rate_2011:null, growth_rate_2001:null
    ,sex_ratio_2022:108.48, sex_ratio_rural_2022:105.7, sex_ratio_urban_2022:102.2
    ,sex_ratio_2011:null, sex_ratio_2001:null
    ,pop_muslim:323566, pop_hindu:10646, pop_buddhist:10160, pop_christian:57, pop_others:116
    ,literacy_total_2022:72.06, literacy_male_2022:36.58, literacy_female_2022:26.02
    ,literacy_rural_2022:null, literacy_urban_2022:null, literacy_2011:null, literacy_2001:null
    ,hh_total_2022:69125, hh_rural_2022:47904, hh_urban_2022:34536, hh_total_2011:null, hh_total_2001:null
    ,hh_general_2022:116478, hh_institutional_2022:142, dwelling_units_2022:59542
    ,hh_size_2022:4.76, hh_size_rural_2022:null, hh_size_urban_2022:null, hh_size_2011:null, hh_size_2001:null
    ,dwelling_pucca_pct:11.69, dwelling_semipucca_pct:3.99, dwelling_kancha_pct:1.98, dwelling_jhupri_pct:19.54
    ,own_dwelling_pct:null, rented_own_elsewhere_pct:null, rented_no_own_pct:null, rentfree_no_own_pct:null
    ,water_tap_pct:null, water_tubewell_pct:null, water_bottled_pct:null
    ,toilet_safe_flush_pct:null, toilet_pit_slab_pct:null, toilet_unsafe_pct:null, toilet_open_defecation_pct:null
    ,electricity_grid_pct:null, electricity_solar_pct:null, electricity_others_pct:null, electricity_none_pct:null
    ,neet_total_pct:34.89, neet_male_pct:12.75, neet_female_pct:58.06
    ,neet_rural_pct:null, neet_urban_pct:null
    ,mobile_phone_pct:66.75, mobile_phone_male_pct:81.78, mobile_phone_female_pct:50.28
    ,mobile_phone_rural_pct:null, mobile_phone_urban_pct:null
    ,internet_pct:36.68, internet_male_pct:50.04, internet_female_pct:22.04
    ,internet_rural_pct:null, internet_urban_pct:null
    ,financial_account_pct:24.87, financial_account_male_pct:33.49, financial_account_female_pct:15.43
    ,mobile_banking_pct:30.2, mobile_banking_male_pct:42.99, mobile_banking_female_pct:16.17
    ,sdg_learning:null, sdg_mobile:50.04, sdg_sanitation:null, sdg_handwashing:null
    ,sdg_electricity:null, sdg_clean_fuel:null, sdg_neet:34.89, sdg_financial:null, sdg_internet:27.71
  },
  {
    id:8, code:"1608", name_en:"Teknaf", name_bn:"টেকনাফ"
    ,unions:6, villages:131, mahalla:20, area_sq_km:388.66
    ,pop_total_2022:333865, pop_male_2022:169068, pop_female_2022:164772, pop_hijra_2022:25
    ,pop_rural_2022:124924, pop_urban_2022:208941
    ,pop_total_2011:null, pop_total_2001:null
    ,urban_pct_2022:62.58, urban_pct_2011:null, urban_pct_2001:null
    ,pop_density_2022:859, pop_density_2011:null, pop_density_2001:null
    ,growth_rate_2022:null, growth_rate_2011:null, growth_rate_2001:null
    ,sex_ratio_2022:102.61, sex_ratio_rural_2022:110.0, sex_ratio_urban_2022:102.61
    ,sex_ratio_2011:null, sex_ratio_2001:null
    ,pop_muslim:325458, pop_hindu:3852, pop_buddhist:4470, pop_christian:65, pop_others:20
    ,literacy_total_2022:64.35, literacy_male_2022:26.68, literacy_female_2022:24.42
    ,literacy_rural_2022:null, literacy_urban_2022:null, literacy_2011:null, literacy_2001:null
    ,hh_total_2022:66597, hh_rural_2022:46328, hh_urban_2022:32205, hh_total_2011:null, hh_total_2001:null
    ,hh_general_2022:65957, hh_institutional_2022:75, dwelling_units_2022:58607
    ,hh_size_2022:4.98, hh_size_rural_2022:null, hh_size_urban_2022:null, hh_size_2011:null, hh_size_2001:null
    ,dwelling_pucca_pct:13.74, dwelling_semipucca_pct:5.76, dwelling_kancha_pct:3.92, dwelling_jhupri_pct:24.96
    ,own_dwelling_pct:null, rented_own_elsewhere_pct:null, rented_no_own_pct:null, rentfree_no_own_pct:null
    ,water_tap_pct:null, water_tubewell_pct:null, water_bottled_pct:null
    ,toilet_safe_flush_pct:null, toilet_pit_slab_pct:null, toilet_unsafe_pct:null, toilet_open_defecation_pct:null
    ,electricity_grid_pct:null, electricity_solar_pct:null, electricity_others_pct:null, electricity_none_pct:null
    ,neet_total_pct:42.56, neet_male_pct:17.19, neet_female_pct:66.81
    ,neet_rural_pct:null, neet_urban_pct:null
    ,mobile_phone_pct:64.15, mobile_phone_male_pct:79.96, mobile_phone_female_pct:48.21
    ,mobile_phone_rural_pct:null, mobile_phone_urban_pct:null
    ,internet_pct:36.71, internet_male_pct:50.61, internet_female_pct:22.69
    ,internet_rural_pct:null, internet_urban_pct:null
    ,financial_account_pct:17.34, financial_account_male_pct:23.73, financial_account_female_pct:10.9
    ,mobile_banking_pct:31.9, mobile_banking_male_pct:44.93, mobile_banking_female_pct:18.75
    ,sdg_learning:null, sdg_mobile:46.23, sdg_sanitation:null, sdg_handwashing:null
    ,sdg_electricity:null, sdg_clean_fuel:null, sdg_neet:42.56, sdg_financial:null, sdg_internet:26.96
  },
  {
    id:9, code:"1609", name_en:"Ukhia", name_bn:"উখিয়া"
    ,unions:5, villages:54, mahalla:0, area_sq_km:261.8
    ,pop_total_2022:263158, pop_male_2022:133109, pop_female_2022:130034, pop_hijra_2022:15
    ,pop_rural_2022:195508, pop_urban_2022:67650
    ,pop_total_2011:null, pop_total_2001:null
    ,urban_pct_2022:25.71, urban_pct_2011:null, urban_pct_2001:null
    ,pop_density_2022:1005, pop_density_2011:null, pop_density_2001:null
    ,growth_rate_2022:null, growth_rate_2011:null, growth_rate_2001:null
    ,sex_ratio_2022:102.36, sex_ratio_rural_2022:107.9, sex_ratio_urban_2022:102.38
    ,sex_ratio_2011:null, sex_ratio_2001:null
    ,pop_muslim:244166, pop_hindu:5568, pop_buddhist:13129, pop_christian:122, pop_others:193
    ,literacy_total_2022:69.95, literacy_male_2022:36.26, literacy_female_2022:28.38
    ,literacy_rural_2022:null, literacy_urban_2022:null, literacy_2011:null, literacy_2001:null
    ,hh_total_2022:55982, hh_rural_2022:37940, hh_urban_2022:25119, hh_total_2011:null, hh_total_2001:null
    ,hh_general_2022:55102, hh_institutional_2022:65, dwelling_units_2022:47717
    ,hh_size_2022:4.69, hh_size_rural_2022:null, hh_size_urban_2022:null, hh_size_2011:null, hh_size_2001:null
    ,dwelling_pucca_pct:12.17, dwelling_semipucca_pct:3.98, dwelling_kancha_pct:2.03, dwelling_jhupri_pct:21.77
    ,own_dwelling_pct:null, rented_own_elsewhere_pct:null, rented_no_own_pct:null, rentfree_no_own_pct:null
    ,water_tap_pct:null, water_tubewell_pct:null, water_bottled_pct:null
    ,toilet_safe_flush_pct:null, toilet_pit_slab_pct:null, toilet_unsafe_pct:null, toilet_open_defecation_pct:null
    ,electricity_grid_pct:null, electricity_solar_pct:null, electricity_others_pct:null, electricity_none_pct:null
    ,neet_total_pct:34.99, neet_male_pct:13.89, neet_female_pct:53.97
    ,neet_rural_pct:null, neet_urban_pct:null
    ,mobile_phone_pct:68.37, mobile_phone_male_pct:82.04, mobile_phone_female_pct:54.61
    ,mobile_phone_rural_pct:null, mobile_phone_urban_pct:null
    ,internet_pct:35.93, internet_male_pct:47.85, internet_female_pct:23.94
    ,internet_rural_pct:null, internet_urban_pct:null
    ,financial_account_pct:20.51, financial_account_male_pct:26.14, financial_account_female_pct:14.85
    ,mobile_banking_pct:41.82, mobile_banking_male_pct:54.25, mobile_banking_female_pct:29.33
    ,sdg_learning:null, sdg_mobile:50.9, sdg_sanitation:null, sdg_handwashing:null
    ,sdg_electricity:null, sdg_clean_fuel:null, sdg_neet:34.99, sdg_financial:null, sdg_internet:27.74
  }
];

// Key Indicator Search Index
var PHC_INDICATOR_INDEX = [
  {key:"pop_total_2022", bn:"মোট জনসংখ্যা", en:"Total Population", cat:"জনসংখ্যা", unit:"জন"},
  {key:"pop_male_2022", bn:"পুরুষ জনসংখ্যা", en:"Male Population", cat:"জনসংখ্যা", unit:"জন"},
  {key:"pop_female_2022", bn:"মহিলা জনসংখ্যা", en:"Female Population", cat:"জনসংখ্যা", unit:"জন"},
  {key:"pop_rural_2022", bn:"গ্রামীণ জনসংখ্যা", en:"Rural Population", cat:"জনসংখ্যা", unit:"জন"},
  {key:"pop_urban_2022", bn:"শহর জনসংখ্যা", en:"Urban Population", cat:"জনসংখ্যা", unit:"জন"},
  {key:"pop_total_2011", bn:"মোট জনসংখ্যা ২০১১", en:"Total Population 2011", cat:"জনসংখ্যা", unit:"জন"},
  {key:"pop_total_2001", bn:"মোট জনসংখ্যা ২০০১", en:"Total Population 2001", cat:"জনসংখ্যা", unit:"জন"},
  {key:"area_sq_km", bn:"আয়তন (বর্গ কি.মি.)", en:"Area sq km", cat:"ভৌগোলিক", unit:"বর্গ কি.মি."},
  {key:"pop_density_2022", bn:"জনসংখ্যার ঘনত্ব", en:"Population Density", cat:"জনসংখ্যা", unit:"প্রতি বর্গ কি.মি."},
  {key:"growth_rate_2022", bn:"বার্ষিক বৃদ্ধির হার", en:"Annual Growth Rate", cat:"জনসংখ্যা", unit:"%"},
  {key:"urban_pct_2022", bn:"শহর জনসংখ্যার অনুপাত", en:"Urban Population %", cat:"নগরায়ন", unit:"%"},
  {key:"sex_ratio_2022", bn:"লিঙ্গানুপাত", en:"Sex Ratio", cat:"জনসংখ্যা", unit:"প্রতি ১০০ মহিলায় পুরুষ"},
  {key:"pop_muslim", bn:"মুসলিম জনসংখ্যা", en:"Muslim Population", cat:"ধর্ম", unit:"জন"},
  {key:"pop_hindu", bn:"হিন্দু জনসংখ্যা", en:"Hindu Population", cat:"ধর্ম", unit:"জন"},
  {key:"pop_buddhist", bn:"বৌদ্ধ জনসংখ্যা", en:"Buddhist Population", cat:"ধর্ম", unit:"জন"},
  {key:"pop_christian", bn:"খ্রিষ্টান জনসংখ্যা", en:"Christian Population", cat:"ধর্ম", unit:"জন"},
  {key:"literacy_total_2022", bn:"সাক্ষরতার হার (মোট)", en:"Literacy Rate Total", cat:"শিক্ষা", unit:"%"},
  {key:"literacy_male_2022", bn:"সাক্ষরতার হার (পুরুষ)", en:"Literacy Rate Male", cat:"শিক্ষা", unit:"%"},
  {key:"literacy_female_2022", bn:"সাক্ষরতার হার (মহিলা)", en:"Literacy Rate Female", cat:"শিক্ষা", unit:"%"},
  {key:"literacy_rural_2022", bn:"গ্রামীণ সাক্ষরতার হার", en:"Rural Literacy Rate", cat:"শিক্ষা", unit:"%"},
  {key:"literacy_urban_2022", bn:"শহর সাক্ষরতার হার", en:"Urban Literacy Rate", cat:"শিক্ষা", unit:"%"},
  {key:"literacy_2011", bn:"সাক্ষরতার হার ২০১১", en:"Literacy Rate 2011", cat:"শিক্ষা", unit:"%"},
  {key:"hh_total_2022", bn:"মোট খানা", en:"Total Households", cat:"খানা", unit:"টি"},
  {key:"hh_size_2022", bn:"গড় খানার আকার", en:"Average Household Size", cat:"খানা", unit:"জন"},
  {key:"hh_size_2011", bn:"গড় খানার আকার ২০১১", en:"Household Size 2011", cat:"খানা", unit:"জন"},
  {key:"dwelling_pucca_pct", bn:"পাকা বাসগৃহ", en:"Pucca Dwelling %", cat:"আবাসন", unit:"%"},
  {key:"dwelling_semipucca_pct", bn:"সেমি-পাকা বাসগৃহ", en:"Semi-Pucca Dwelling %", cat:"আবাসন", unit:"%"},
  {key:"dwelling_kancha_pct", bn:"কাঁচা বাসগৃহ", en:"Kancha Dwelling %", cat:"আবাসন", unit:"%"},
  {key:"dwelling_jhupri_pct", bn:"ঝুপড়ি বাসগৃহ", en:"Jhupri Dwelling %", cat:"আবাসন", unit:"%"},
  {key:"own_dwelling_pct", bn:"নিজস্ব বাসগৃহ", en:"Own Dwelling %", cat:"আবাসন", unit:"%"},
  {key:"water_tubewell_pct", bn:"নলকূপ পানির উৎস", en:"Tubewell Water %", cat:"পানি ও স্যানিটেশন", unit:"%"},
  {key:"water_tap_pct", bn:"ট্যাপ/পাইপ পানির উৎস", en:"Tap/Pipe Water %", cat:"পানি ও স্যানিটেশন", unit:"%"},
  {key:"toilet_safe_flush_pct", bn:"নিরাপদ টয়লেট", en:"Safe Toilet Flush %", cat:"পানি ও স্যানিটেশন", unit:"%"},
  {key:"toilet_open_defecation_pct", bn:"খোলা মলত্যাগ", en:"Open Defecation %", cat:"পানি ও স্যানিটেশন", unit:"%"},
  {key:"electricity_grid_pct", bn:"জাতীয় গ্রিড বিদ্যুৎ", en:"National Grid Electricity %", cat:"বিদ্যুৎ", unit:"%"},
  {key:"electricity_solar_pct", bn:"সোলার বিদ্যুৎ", en:"Solar Electricity %", cat:"বিদ্যুৎ", unit:"%"},
  {key:"electricity_none_pct", bn:"বিদ্যুৎ নেই", en:"No Electricity %", cat:"বিদ্যুৎ", unit:"%"},
  {key:"neet_total_pct", bn:"NEET যুব জনগোষ্ঠী (মোট)", en:"NEET Youth Total %", cat:"কর্মসংস্থান", unit:"%"},
  {key:"neet_male_pct", bn:"NEET যুব জনগোষ্ঠী (পুরুষ)", en:"NEET Male %", cat:"কর্মসংস্থান", unit:"%"},
  {key:"neet_female_pct", bn:"NEET যুব জনগোষ্ঠী (মহিলা)", en:"NEET Female %", cat:"কর্মসংস্থান", unit:"%"},
  {key:"mobile_phone_pct", bn:"মোবাইল ফোন ব্যবহারকারী", en:"Mobile Phone Users %", cat:"প্রযুক্তি", unit:"%"},
  {key:"mobile_phone_male_pct", bn:"মোবাইল ফোন (পুরুষ)", en:"Mobile Phone Male %", cat:"প্রযুক্তি", unit:"%"},
  {key:"mobile_phone_female_pct", bn:"মোবাইল ফোন (মহিলা)", en:"Mobile Phone Female %", cat:"প্রযুক্তি", unit:"%"},
  {key:"internet_pct", bn:"ইন্টারনেট ব্যবহারকারী", en:"Internet Users %", cat:"প্রযুক্তি", unit:"%"},
  {key:"internet_male_pct", bn:"ইন্টারনেট ব্যবহারকারী (পুরুষ)", en:"Internet Male %", cat:"প্রযুক্তি", unit:"%"},
  {key:"internet_female_pct", bn:"ইন্টারনেট ব্যবহারকারী (মহিলা)", en:"Internet Female %", cat:"প্রযুক্তি", unit:"%"},
  {key:"financial_account_pct", bn:"আর্থিক অ্যাকাউন্টধারী", en:"Financial Account %", cat:"আর্থিক অন্তর্ভুক্তি", unit:"%"},
  {key:"financial_account_male_pct", bn:"আর্থিক অ্যাকাউন্ট (পুরুষ)", en:"Financial Account Male %", cat:"আর্থিক অন্তর্ভুক্তি", unit:"%"},
  {key:"financial_account_female_pct", bn:"আর্থিক অ্যাকাউন্ট (মহিলা)", en:"Financial Account Female %", cat:"আর্থিক অন্তর্ভুক্তি", unit:"%"},
  {key:"mobile_banking_pct", bn:"মোবাইল ব্যাংকিং", en:"Mobile Banking %", cat:"আর্থিক অন্তর্ভুক্তি", unit:"%"},
  {key:"mobile_banking_male_pct", bn:"মোবাইল ব্যাংকিং (পুরুষ)", en:"Mobile Banking Male %", cat:"আর্থিক অন্তর্ভুক্তি", unit:"%"},
  {key:"mobile_banking_female_pct", bn:"মোবাইল ব্যাংকিং (মহিলা)", en:"Mobile Banking Female %", cat:"আর্থিক অন্তর্ভুক্তি", unit:"%"},
  {key:"sdg_sanitation", bn:"SDG - স্বাস্থ্যসম্মত স্যানিটেশন (6.2.1a)", en:"SDG Basic Sanitation %", cat:"SDG সূচক", unit:"%"},
  {key:"sdg_handwashing", bn:"SDG - হাত ধোয়ার সুবিধা (6.2.1b)", en:"SDG Handwashing %", cat:"SDG সূচক", unit:"%"},
  {key:"sdg_electricity", bn:"SDG - বিদ্যুৎ সুবিধা (7.1.1)", en:"SDG Electricity %", cat:"SDG সূচক", unit:"%"},
  {key:"sdg_clean_fuel", bn:"SDG - পরিষ্কার জ্বালানি (7.1.2)", en:"SDG Clean Fuel %", cat:"SDG সূচক", unit:"%"},
  {key:"sdg_learning", bn:"SDG - শিক্ষায় অংশগ্রহণ (4.2.2)", en:"SDG Learning %", cat:"SDG সূচক", unit:"%"},
  {key:"sdg_mobile", bn:"SDG - মোবাইল ফোন মালিকানা (5.b.1)", en:"SDG Mobile %", cat:"SDG সূচক", unit:"%"},
  {key:"sdg_neet", bn:"SDG - NEET যুব (8.6.1)", en:"SDG NEET %", cat:"SDG সূচক", unit:"%"},
  {key:"sdg_financial", bn:"SDG - আর্থিক অন্তর্ভুক্তি (8.10.2)", en:"SDG Financial %", cat:"SDG সূচক", unit:"%"},
  {key:"sdg_internet", bn:"SDG - ইন্টারনেট ব্যবহারকারী (17.8.1)", en:"SDG Internet %", cat:"SDG সূচক", unit:"%"},
  {key:"unions", bn:"ইউনিয়নের সংখ্যা", en:"Number of Unions", cat:"প্রশাসনিক", unit:"টি"},
  {key:"villages", bn:"গ্রামের সংখ্যা", en:"Number of Villages", cat:"প্রশাসনিক", unit:"টি"},
  {key:"dwelling_units_2022", bn:"বাসগৃহের সংখ্যা", en:"Dwelling Units", cat:"আবাসন", unit:"টি"},
];
