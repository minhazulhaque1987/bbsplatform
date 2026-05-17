/* ============================================================
   PHC 2022 — চট্টগ্রাম (Chittagong) জেলার সমন্বিত ডাটাবেইজ
   Population and Housing Census 2022 - Chittagong District
   ============================================================ */

const PHC_CHITTAGONG = {
  district: {
    id: "chittagong",
    code: "15",
    name_en: "Chittagong",
    name_bn: "চট্টগ্রাম",
    division_en: "Chattogram",
    division_bn: "চট্টগ্রাম",
    report_type: "district",
    upazila_count: 15,
    paurashava_count: 0,
    union_count: 181,
    city_corp_thana_count: 15,
    pop_total_2022: 9169465,
    pop_male_2022: 4570113,
    pop_female_2022: 4598926,
    pop_hijra_2022: 426,
    pop_rural_2022: 4284249,
    pop_urban_2022: 4885216,
    sex_ratio_2022: 99.37,
    hh_total_2022: 2141904,
    hh_general_2022: 2080394,
    hh_institutional_2022: 2930,
    hh_others_2022: 58580,
    pop_muslim: 8026102,
    pop_hindu: 982604,
    pop_christian: 8096,
    pop_buddhist: 149775,
    pop_others_religion: 2888,
    literacy_5plus_total: 80.21,
    literacy_5plus_male: 81.87,
    literacy_5plus_female: 78.56,
    literacy_7plus_total: 81.06,
    literacy_7plus_male: 82.88,
    literacy_7plus_female: 79.26,
    literacy_15plus_total: 78.36,
    literacy_15plus_male: 80.69,
    literacy_15plus_female: 76.12,
    mobile_phone_pct: 61.07,
    internet_5plus_pct: 41.72,
    internet_15plus_pct: 46.38,
    financial_account_pct: 45.79,
    mobile_banking_pct: 30.38,
    dwelling_pucca_pct: 43.49,
    dwelling_semi_pucca_pct: 17.77,
    dwelling_kancha_pct: 37.72,
    dwelling_jhupri_pct: 1.01,
    electricity_pct: 99.25,
    clean_fuel_pct: 49.98,
    safe_toilet_pct: 64.80,
    handwashing_facility_pct: 75.31,
    neet_youth_pct: 30.38,
    urban_slum_pct: 5.91
  },

  upazilas: [
    {
      id: 1,
      code: "04",
      name_en: "Anwara",
      name_bn: "আনোয়ারা",
      union_count: 11,
      pop_total_2022: 319482,
      pop_male_2022: 158444,
      pop_female_2022: 161038,
      pop_hijra_2022: 0,
      sex_ratio_2022: 98.39,
      hh_total_2022: 69057,
      hh_general_2022: 68379,
      pop_muslim: 277284,
      pop_hindu: 40741,
      pop_christian: 53,
      pop_buddhist: 1396,
      pop_others_religion: 8,
      literacy_5plus_total: 74.97,
      literacy_5plus_male: 77.45,
      literacy_5plus_female: 72.54,
      literacy_7plus_total: 75.90,
      literacy_15plus_total: 71.57,
      mobile_phone_pct: 54.60,
      internet_5plus_pct: 30.74,
      internet_15plus_pct: 39.80,
      financial_account_pct: 25.39,
      mobile_banking_pct: 31.91,
      dwelling_pucca_pct: 27.01,
      dwelling_semi_pucca_pct: 20.79,
      dwelling_kancha_pct: 50.26,
      dwelling_jhupri_pct: 1.94,
      electricity_pct: 99.74,
      safe_toilet_pct: 58.62,
      clean_fuel_pct: 30.78
    },
    {
      id: 2,
      code: "08",
      name_en: "Banshkhali",
      name_bn: "বাঁশখালী",
      union_count: 14,
      pop_total_2022: 537593,
      pop_male_2022: 268702,
      pop_female_2022: 268853,
      pop_hijra_2022: 38,
      sex_ratio_2022: 99.94,
      hh_total_2022: 111743,
      hh_general_2022: 110863,
      pop_muslim: 489041,
      pop_hindu: 44224,
      pop_christian: 173,
      pop_buddhist: 4141,
      pop_others_religion: 14,
      literacy_5plus_total: 70.22,
      literacy_5plus_male: 71.35,
      literacy_5plus_female: 69.09,
      literacy_7plus_total: 71.32,
      literacy_15plus_total: 65.72,
      mobile_phone_pct: 51.69,
      internet_5plus_pct: 33.45,
      internet_15plus_pct: 43.26,
      financial_account_pct: 21.49,
      mobile_banking_pct: 26.64,
      dwelling_pucca_pct: 15.02,
      dwelling_semi_pucca_pct: 10.17,
      dwelling_kancha_pct: 68.84,
      dwelling_jhupri_pct: 5.98,
      electricity_pct: 99.15,
      safe_toilet_pct: 36.71,
      clean_fuel_pct: 15.42
    },
    {
      id: 3,
      code: "12",
      name_en: "Boalkhali",
      name_bn: "বোয়ালখালী",
      union_count: 9,
      pop_total_2022: 258688,
      pop_male_2022: 126512,
      pop_female_2022: 132163,
      pop_hijra_2022: 13,
      sex_ratio_2022: 95.72,
      hh_total_2022: 58014,
      hh_general_2022: 57236,
      pop_muslim: 209389,
      pop_hindu: 44796,
      pop_christian: 197,
      pop_buddhist: 4290,
      pop_others_religion: 16,
      literacy_5plus_total: 82.61,
      literacy_5plus_male: 84.29,
      literacy_5plus_female: 81.01,
      literacy_7plus_total: 83.45,
      literacy_15plus_total: 80.83,
      mobile_phone_pct: 59.18,
      internet_5plus_pct: 35.75,
      internet_15plus_pct: 44.62,
      financial_account_pct: 30.20,
      mobile_banking_pct: 35.42,
      dwelling_pucca_pct: 32.91,
      dwelling_semi_pucca_pct: 11.66,
      dwelling_kancha_pct: 53.52,
      dwelling_jhupri_pct: 1.91,
      electricity_pct: 99.70,
      safe_toilet_pct: 69.82,
      clean_fuel_pct: 27.22
    },
    {
      id: 4,
      code: "18",
      name_en: "Chandanaish",
      name_bn: "চন্দনাইশ",
      union_count: 9,
      pop_total_2022: 252242,
      pop_male_2022: 119860,
      pop_female_2022: 132378,
      pop_hijra_2022: 4,
      sex_ratio_2022: 90.54,
      hh_total_2022: 56197,
      hh_general_2022: 55477,
      pop_muslim: 220218,
      pop_hindu: 26814,
      pop_christian: 627,
      pop_buddhist: 4568,
      pop_others_religion: 15,
      literacy_5plus_total: 79.03,
      literacy_5plus_male: 79.99,
      literacy_5plus_female: 78.18,
      literacy_7plus_total: 79.69,
      literacy_15plus_total: 75.71,
      mobile_phone_pct: 53.61,
      internet_5plus_pct: 33.84,
      internet_15plus_pct: 42.17,
      financial_account_pct: 29.51,
      mobile_banking_pct: 34.27,
      dwelling_pucca_pct: 27.87,
      dwelling_semi_pucca_pct: 16.49,
      dwelling_kancha_pct: 55.05,
      dwelling_jhupri_pct: 0.59,
      electricity_pct: 99.46,
      safe_toilet_pct: 52.23,
      clean_fuel_pct: 19.37
    },
    {
      id: 5,
      code: "33",
      name_en: "Fatikchhari",
      name_bn: "ফটিকছড়ি",
      union_count: 18,
      pop_total_2022: 642089,
      pop_male_2022: 309701,
      pop_female_2022: 332375,
      pop_hijra_2022: 13,
      sex_ratio_2022: 93.18,
      hh_total_2022: 142906,
      hh_general_2022: 141579,
      pop_muslim: 569978,
      pop_hindu: 62414,
      pop_christian: 201,
      pop_buddhist: 8656,
      pop_others_religion: 840,
      literacy_5plus_total: 74.97,
      literacy_5plus_male: 76.79,
      literacy_5plus_female: 73.30,
      literacy_7plus_total: 76.11,
      literacy_15plus_total: 72.03,
      mobile_phone_pct: 55.97,
      internet_5plus_pct: 37.29,
      internet_15plus_pct: 46.82,
      financial_account_pct: 26.82,
      mobile_banking_pct: 31.60,
      dwelling_pucca_pct: 27.93,
      dwelling_semi_pucca_pct: 14.34,
      dwelling_kancha_pct: 56.97,
      dwelling_jhupri_pct: 0.76,
      electricity_pct: 97.98,
      safe_toilet_pct: 55.14,
      clean_fuel_pct: 14.00
    },
    {
      id: 6,
      code: "37",
      name_en: "Hathazari",
      name_bn: "হাটহাজারী",
      union_count: 14,
      pop_total_2022: 498182,
      pop_male_2022: 242383,
      pop_female_2022: 255796,
      pop_hijra_2022: 3,
      sex_ratio_2022: 94.76,
      hh_total_2022: 109952,
      hh_general_2022: 107594,
      pop_muslim: 448675,
      pop_hindu: 43497,
      pop_christian: 330,
      pop_buddhist: 5628,
      pop_others_religion: 52,
      literacy_5plus_total: 85.51,
      literacy_5plus_male: 87.37,
      literacy_5plus_female: 83.77,
      literacy_7plus_total: 86.28,
      literacy_15plus_total: 84.11,
      mobile_phone_pct: 61.03,
      internet_5plus_pct: 43.20,
      internet_15plus_pct: 53.40,
      financial_account_pct: 30.00,
      mobile_banking_pct: 35.33,
      dwelling_pucca_pct: 47.81,
      dwelling_semi_pucca_pct: 20.57,
      dwelling_kancha_pct: 30.87,
      dwelling_jhupri_pct: 0.74,
      electricity_pct: 99.68,
      safe_toilet_pct: 70.74,
      clean_fuel_pct: 52.68
    },
    {
      id: 7,
      code: "39",
      name_en: "Karnaphuli",
      name_bn: "কর্ণফুলী",
      union_count: 5,
      pop_total_2022: 203705,
      pop_male_2022: 103878,
      pop_female_2022: 99819,
      pop_hijra_2022: 8,
      sex_ratio_2022: 104.07,
      hh_total_2022: 43603,
      hh_general_2022: 42866,
      pop_muslim: 196589,
      pop_hindu: 6051,
      pop_christian: 655,
      pop_buddhist: 346,
      pop_others_religion: 64,
      literacy_5plus_total: 76.33,
      literacy_5plus_male: 78.76,
      literacy_5plus_female: 73.80,
      literacy_7plus_total: 77.15,
      literacy_15plus_total: 73.57,
      mobile_phone_pct: 56.52,
      internet_5plus_pct: 32.56,
      internet_15plus_pct: 40.04,
      financial_account_pct: 26.14,
      mobile_banking_pct: 33.29,
      dwelling_pucca_pct: 32.15,
      dwelling_semi_pucca_pct: 26.55,
      dwelling_kancha_pct: 40.36,
      dwelling_jhupri_pct: 0.93,
      electricity_pct: 99.65,
      safe_toilet_pct: 66.83,
      clean_fuel_pct: 50.17
    },
    {
      id: 8,
      code: "47",
      name_en: "Lohagara",
      name_bn: "লোহাগাড়া",
      union_count: 9,
      pop_total_2022: 328220,
      pop_male_2022: 155152,
      pop_female_2022: 173054,
      pop_hijra_2022: 14,
      sex_ratio_2022: 89.66,
      hh_total_2022: 71711,
      hh_general_2022: 70731,
      pop_muslim: 298463,
      pop_hindu: 23699,
      pop_christian: 22,
      pop_buddhist: 6015,
      pop_others_religion: 21,
      literacy_5plus_total: 81.58,
      literacy_5plus_male: 83.10,
      literacy_5plus_female: 80.24,
      literacy_7plus_total: 82.41,
      literacy_15plus_total: 78.90,
      mobile_phone_pct: 53.32,
      internet_5plus_pct: 36.50,
      internet_15plus_pct: 46.76,
      financial_account_pct: 27.76,
      mobile_banking_pct: 33.86,
      dwelling_pucca_pct: 29.42,
      dwelling_semi_pucca_pct: 12.30,
      dwelling_kancha_pct: 57.98,
      dwelling_jhupri_pct: 0.30,
      electricity_pct: 99.47,
      safe_toilet_pct: 55.60,
      clean_fuel_pct: 18.99
    },
    {
      id: 9,
      code: "53",
      name_en: "Mirsarai",
      name_bn: "মীরসরাই",
      union_count: 16,
      pop_total_2022: 472794,
      pop_male_2022: 228303,
      pop_female_2022: 244474,
      pop_hijra_2022: 17,
      sex_ratio_2022: 93.39,
      hh_total_2022: 111009,
      hh_general_2022: 109581,
      pop_muslim: 410248,
      pop_hindu: 56343,
      pop_christian: 216,
      pop_buddhist: 5854,
      pop_others_religion: 133,
      literacy_5plus_total: 79.01,
      literacy_5plus_male: 81.54,
      literacy_5plus_female: 76.68,
      literacy_7plus_total: 79.61,
      literacy_15plus_total: 76.10,
      mobile_phone_pct: 58.77,
      internet_5plus_pct: 38.95,
      internet_15plus_pct: 47.35,
      financial_account_pct: 28.40,
      mobile_banking_pct: 33.95,
      dwelling_pucca_pct: 25.69,
      dwelling_semi_pucca_pct: 9.72,
      dwelling_kancha_pct: 64.08,
      dwelling_jhupri_pct: 0.52,
      electricity_pct: 99.42,
      safe_toilet_pct: 60.76,
      clean_fuel_pct: 10.54
    },
    {
      id: 10,
      code: "61",
      name_en: "Patiya",
      name_bn: "পটিয়া",
      union_count: 17,
      pop_total_2022: 397679,
      pop_male_2022: 198164,
      pop_female_2022: 199508,
      pop_hijra_2022: 7,
      sex_ratio_2022: 99.33,
      hh_total_2022: 87401,
      hh_general_2022: 86589,
      pop_muslim: 319135,
      pop_hindu: 71528,
      pop_christian: 88,
      pop_buddhist: 6914,
      pop_others_religion: 14,
      literacy_5plus_total: 80.35,
      literacy_5plus_male: 82.45,
      literacy_5plus_female: 78.29,
      literacy_7plus_total: 81.10,
      literacy_15plus_total: 77.94,
      mobile_phone_pct: 58.49,
      internet_5plus_pct: 34.60,
      internet_15plus_pct: 43.08,
      financial_account_pct: 29.09,
      mobile_banking_pct: 35.91,
      dwelling_pucca_pct: 32.54,
      dwelling_semi_pucca_pct: 17.36,
      dwelling_kancha_pct: 48.33,
      dwelling_jhupri_pct: 1.77,
      electricity_pct: 99.70,
      safe_toilet_pct: 62.23,
      clean_fuel_pct: 32.24
    },
    {
      id: 11,
      code: "70",
      name_en: "Rangunia",
      name_bn: "রাঙ্গুনিয়া",
      union_count: 15,
      pop_total_2022: 392904,
      pop_male_2022: 187565,
      pop_female_2022: 205333,
      pop_hijra_2022: 6,
      sex_ratio_2022: 91.35,
      hh_total_2022: 90708,
      hh_general_2022: 89304,
      pop_muslim: 330895,
      pop_hindu: 45014,
      pop_christian: 301,
      pop_buddhist: 16604,
      pop_others_religion: 90,
      literacy_5plus_total: 76.52,
      literacy_5plus_male: 77.41,
      literacy_5plus_female: 75.73,
      literacy_7plus_total: 77.60,
      literacy_15plus_total: 73.62,
      mobile_phone_pct: 56.69,
      internet_5plus_pct: 39.68,
      internet_15plus_pct: 49.41,
      financial_account_pct: 31.26,
      mobile_banking_pct: 35.20,
      dwelling_pucca_pct: 27.23,
      dwelling_semi_pucca_pct: 14.12,
      dwelling_kancha_pct: 57.11,
      dwelling_jhupri_pct: 1.55,
      electricity_pct: 99.04,
      safe_toilet_pct: 48.83,
      clean_fuel_pct: 26.73
    },
    {
      id: 12,
      code: "74",
      name_en: "Raozan",
      name_bn: "রাউজান",
      union_count: 14,
      pop_total_2022: 396358,
      pop_male_2022: 189682,
      pop_female_2022: 206668,
      pop_hijra_2022: 8,
      sex_ratio_2022: 91.78,
      hh_total_2022: 88071,
      hh_general_2022: 86849,
      pop_muslim: 302605,
      pop_hindu: 66990,
      pop_christian: 127,
      pop_buddhist: 26597,
      pop_others_religion: 39,
      literacy_5plus_total: 84.04,
      literacy_5plus_male: 85.36,
      literacy_5plus_female: 82.85,
      literacy_7plus_total: 84.87,
      literacy_15plus_total: 82.46,
      mobile_phone_pct: 61.01,
      internet_5plus_pct: 40.53,
      internet_15plus_pct: 50.57,
      financial_account_pct: 33.53,
      mobile_banking_pct: 39.20,
      dwelling_pucca_pct: 41.33,
      dwelling_semi_pucca_pct: 16.90,
      dwelling_kancha_pct: 40.92,
      dwelling_jhupri_pct: 0.84,
      electricity_pct: 99.74,
      safe_toilet_pct: 66.30,
      clean_fuel_pct: 38.02
    },
    {
      id: 13,
      code: "78",
      name_en: "Sandwip",
      name_bn: "সন্দ্বীপ",
      union_count: 15,
      pop_total_2022: 327564,
      pop_male_2022: 156008,
      pop_female_2022: 171545,
      pop_hijra_2022: 11,
      sex_ratio_2022: 90.94,
      hh_total_2022: 74242,
      hh_general_2022: 73782,
      pop_muslim: 301037,
      pop_hindu: 26425,
      pop_christian: 19,
      pop_buddhist: 51,
      pop_others_religion: 32,
      literacy_5plus_total: 73.20,
      literacy_5plus_male: 73.50,
      literacy_5plus_female: 72.94,
      literacy_7plus_total: 74.14,
      literacy_15plus_total: 69.76,
      mobile_phone_pct: 56.05,
      internet_5plus_pct: 38.98,
      internet_15plus_pct: 49.36,
      financial_account_pct: 21.73,
      mobile_banking_pct: 25.74,
      dwelling_pucca_pct: 9.85,
      dwelling_semi_pucca_pct: 10.77,
      dwelling_kancha_pct: 78.87,
      dwelling_jhupri_pct: 0.51,
      electricity_pct: 98.11,
      safe_toilet_pct: 53.26,
      clean_fuel_pct: 8.41
    },
    {
      id: 14,
      code: "82",
      name_en: "Satkania",
      name_bn: "সাতকানিয়া",
      union_count: 17,
      pop_total_2022: 454062,
      pop_male_2022: 215847,
      pop_female_2022: 238204,
      pop_hijra_2022: 11,
      sex_ratio_2022: 90.61,
      hh_total_2022: 100763,
      hh_general_2022: 99446,
      pop_muslim: 414092,
      pop_hindu: 36116,
      pop_christian: 42,
      pop_buddhist: 3750,
      pop_others_religion: 62,
      literacy_5plus_total: 80.02,
      literacy_5plus_male: 81.42,
      literacy_5plus_female: 78.77,
      literacy_7plus_total: 80.84,
      literacy_15plus_total: 76.80,
      mobile_phone_pct: 54.58,
      internet_5plus_pct: 38.39,
      internet_15plus_pct: 48.05,
      financial_account_pct: 30.29,
      mobile_banking_pct: 37.68,
      dwelling_pucca_pct: 32.91,
      dwelling_semi_pucca_pct: 12.67,
      dwelling_kancha_pct: 53.70,
      dwelling_jhupri_pct: 0.73,
      electricity_pct: 99.47,
      safe_toilet_pct: 55.83,
      clean_fuel_pct: 20.49
    },
    {
      id: 15,
      code: "86",
      name_en: "Sitakunda",
      name_bn: "সীতাকুণ্ড",
      union_count: 9,
      pop_total_2022: 457396,
      pop_male_2022: 233754,
      pop_female_2022: 223614,
      pop_hijra_2022: 28,
      sex_ratio_2022: 104.53,
      hh_total_2022: 105240,
      hh_general_2022: 102336,
      pop_muslim: 396858,
      pop_hindu: 58386,
      pop_christian: 252,
      pop_buddhist: 1784,
      pop_others_religion: 116,
      literacy_5plus_total: 77.49,
      literacy_5plus_male: 79.86,
      literacy_5plus_female: 75.02,
      literacy_7plus_total: 78.33,
      literacy_15plus_total: 75.50,
      mobile_phone_pct: 60.33,
      internet_5plus_pct: 38.63,
      internet_15plus_pct: 46.82,
      financial_account_pct: 27.32,
      mobile_banking_pct: 35.24,
      dwelling_pucca_pct: 26.78,
      dwelling_semi_pucca_pct: 16.15,
      dwelling_kancha_pct: 56.49,
      dwelling_jhupri_pct: 0.57,
      electricity_pct: 98.90,
      safe_toilet_pct: 53.93,
      clean_fuel_pct: 41.18
    }
  ]
};

// ============================================================
// App-Ready Helper Functions
// ============================================================

/**
 * Get all upazila names with Bangla
 */
function getUpazilaList() {
  return PHC_CHITTAGONG.upazilas.map(u => ({
    id: u.id,
    code: u.code,
    name_en: u.name_en,
    name_bn: u.name_bn
  }));
}

/**
 * Search upazila by English name (partial match, case-insensitive)
 */
function findUpazilaByName(searchTerm) {
  const term = searchTerm.toLowerCase();
  return PHC_CHITTAGONG.upazilas.filter(u =>
    u.name_en.toLowerCase().includes(term)
  );
}

/**
 * Search upazila by Bangla name
 */
function findUpazilaByBanglaName(searchTerm) {
  return PHC_CHITTAGONG.upazilas.filter(u =>
    u.name_bn.includes(searchTerm)
  );
}

/**
 * Get single upazila by code
 */
function findUpazilaByCode(code) {
  return PHC_CHITTAGONG.upazilas.find(u => u.code === code);
}

/**
 * Get single upazila by ID
 */
function findUpazilaById(id) {
  return PHC_CHITTAGONG.upazilas.find(u => u.id === id);
}

/**
 * Sort and return top upazilas by any numeric indicator
 * @param {string} indicator - field name to sort by
 * @param {number} limit - number of results
 * @param {boolean} ascending - sort order
 */
function getTopUpazilas(indicator, limit = 5, ascending = false) {
  const sorted = PHC_CHITTAGONG.upazilas
    .filter(u => typeof u[indicator] === 'number')
    .sort((a, b) => ascending
      ? (a[indicator] - b[indicator])
      : (b[indicator] - a[indicator])
    );
  return sorted.slice(0, limit);
}

/**
 * Compare multiple upazilas by indicator
 * @param {string[]} upazilaCodes - array of upazila codes
 * @param {string[]} indicators - array of field names
 */
function compareUpazilas(upazilaCodes, indicators) {
  return PHC_CHITTAGONG.upazilas
    .filter(u => upazilaCodes.includes(u.code))
    .map(u => {
      const result = { name: u.name_en, name_bn: u.name_bn, code: u.code };
      indicators.forEach(ind => { result[ind] = u[ind]; });
      return result;
    });
}

/**
 * Get district summary with key indicators
 */
function getDistrictSummary() {
  const d = PHC_CHITTAGONG.district;
  return {
    name: d.name_en,
    name_bn: d.name_bn,
    total_population: d.pop_total_2022,
    total_households: d.hh_total_2022,
    total_upazilas: d.upazila_count,
    total_unions: d.union_count,
    sex_ratio: d.sex_ratio_2022,
    literacy_rate: d.literacy_7plus_total,
    electricity_coverage: d.electricity_pct,
    internet_penetration: d.internet_15plus_pct,
    mobile_phone_usage: d.mobile_phone_pct,
    financial_inclusion: d.financial_account_pct,
    mobile_banking: d.mobile_banking_pct,
    safe_sanitation: d.safe_toilet_pct,
    clean_fuel: d.clean_fuel_pct,
    pucca_housing: d.dwelling_pucca_pct
  };
}

/**
 * Filter upazilas by indicator range
 * @param {string} indicator - field name
 * @param {number} minVal - minimum value
 * @param {number} maxVal - maximum value
 */
function filterUpazilasByRange(indicator, minVal, maxVal) {
  return PHC_CHITTAGONG.upazilas.filter(u => {
    const val = u[indicator];
    return typeof val === 'number' && val >= minVal && val <= maxVal;
  });
}

/**
 * Get all available indicators for an upazila
 */
function getUpazilaIndicators(code) {
  const u = findUpazilaByCode(code);
  if (!u) return null;
  return {
    basic: {
      population: u.pop_total_2022,
      male: u.pop_male_2022,
      female: u.pop_female_2022,
      hijra: u.pop_hijra_2022,
      sex_ratio: u.sex_ratio_2022,
      households: u.hh_total_2022,
      unions: u.union_count
    },
    education: {
      literacy_5plus: u.literacy_5plus_total,
      literacy_5plus_male: u.literacy_5plus_male,
      literacy_5plus_female: u.literacy_5plus_female,
      literacy_7plus: u.literacy_7plus_total,
      literacy_15plus: u.literacy_15plus_total
    },
    religion: {
      muslim: u.pop_muslim,
      hindu: u.pop_hindu,
      christian: u.pop_christian,
      buddhist: u.pop_buddhist,
      others: u.pop_others_religion
    },
    digital: {
      mobile_phone: u.mobile_phone_pct,
      internet_5plus: u.internet_5plus_pct,
      internet_15plus: u.internet_15plus_pct
    },
    financial: {
      account: u.financial_account_pct,
      mobile_banking: u.mobile_banking_pct
    },
    housing: {
      pucca: u.dwelling_pucca_pct,
      semi_pucca: u.dwelling_semi_pucca_pct,
      kancha: u.dwelling_kancha_pct,
      jhupri: u.dwelling_jhupri_pct
    },
    utilities: {
      electricity: u.electricity_pct,
      safe_toilet: u.safe_toilet_pct,
      clean_fuel: u.clean_fuel_pct
    }
  };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PHC_CHITTAGONG,
    getUpazilaList,
    findUpazilaByName,
    findUpazilaByBanglaName,
    findUpazilaByCode,
    findUpazilaById,
    getTopUpazilas,
    compareUpazilas,
    getDistrictSummary,
    filterUpazilasByRange,
    getUpazilaIndicators
  };
}
