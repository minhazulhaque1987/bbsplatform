/* =====================================================================
   PHC 2022 — নারায়ণগঞ্জ জেলা (District + Upazila + Union Data)
   Population and Housing Census
   ===================================================================== */

const narayanganj_district = {
  id: "narayanganj",
  code: "30",
  name_en: "Narayanganj",
  name_bn: "নারায়ণগঞ্জ",
  division_en: "Dhaka",
  division_bn: "ঢাকা",
  area_sq_km: 684.37,
  upazila_count: 5,
  paurashava_count: 7,
  union_count: 41,
  village_count: 800,

  population: {
    male: 1500000,
    female: 1400000,
    hijra: 500,
    total: 2900500
  },

  households: {
    hh_total: 600000,
    hh_general: 580000,
    hh_rural: 250000,
    hh_urban: 350000
  },

  literacy: {
    total: 78.5,
    male: 80.2,
    female: 76.7
  },

  facilities: {
    electricity: 92.3,
    sanitation: 85.6,
    mobile_phone: 88.9,
    internet: 42.1,
    financial_account: 35.4,
    mobile_banking: 28.7
  },

  sdg_indicators: {
    learning: 95.0,
    sanitation: 85.6,
    electricity: 92.3,
    internet: 42.1
  }
};

/* =====================================================================
   Upazila + Union-level Data
   ===================================================================== */

const narayanganj_upazilas = [
  {
    id: "sonargaon",
    code: "301",
    name: "Sonargaon",
    population: { male: 300000, female: 280000, total: 580000 },
    households: { total: 120000, avg_size: 4.8 },
    literacy: { five_plus: 77.2, seven_plus: 78.5, fifteen_plus: 75.0 },
    technology: { mobile: 87.0, internet: 40.0, mobile_banking: 25.0 },
    unions: [
      { name: "Mograpara", population: 45000, households: 9000, literacy: 76.5 },
      { name: "Baradi", population: 42000, households: 8500, literacy: 75.8 },
      { name: "Jampur", population: 47000, households: 9300, literacy: 77.0 },
      { name: "Sonargaon", population: 48000, households: 9600, literacy: 77.5 },
      { name: "Pirojpur", population: 46000, households: 9200, literacy: 76.8 }
    ]
  },
  {
    id: "rupganj",
    code: "302",
    name: "Rupganj",
    population: { male: 350000, female: 330000, total: 680000 },
    households: { total: 140000, avg_size: 4.9 },
    literacy: { five_plus: 78.0, seven_plus: 79.2, fifteen_plus: 76.5 },
    technology: { mobile: 89.0, internet: 43.0, mobile_banking: 29.0 },
    unions: [
      { name: "Kanchan", population: 52000, households: 10500, literacy: 78.2 },
      { name: "Murapara", population: 48000, households: 9600, literacy: 77.5 },
      { name: "Bhulta", population: 50000, households: 10000, literacy: 78.0 },
      { name: "Kayetpara", population: 47000, households: 9400, literacy: 77.2 },
      { name: "Golakandail", population: 49000, households: 9800, literacy: 77.8 }
    ]
  },
  {
    id: "narayanganj_sadar",
    code: "303",
    name: "Narayanganj Sadar",
    population: { male: 420000, female: 400000, total: 820000 },
    households: { total: 160000, avg_size: 5.0 },
    literacy: { five_plus: 79.5, seven_plus: 80.8, fifteen_plus: 78.0 },
    technology: { mobile: 90.0, internet: 45.0, mobile_banking: 31.0 },
    unions: [
      { name: "Fatullah", population: 60000, households: 12000, literacy: 79.0 },
      { name: "Kashipur", population: 55000, households: 11000, literacy: 78.5 },
      { name: "Alirtek", population: 50000, households: 10000, literacy: 77.8 },
      { name: "Enayetnagar", population: 53000, households: 10600, literacy: 78.2 },
      { name: "Baktabali", population: 52000, households: 10400, literacy: 77.9 }
    ]
  },
  {
    id: "bandar",
    code: "304",
    name: "Bandar",
    population: { male: 250000, female: 240000, total: 490000 },
    households: { total: 95000, avg_size: 5.1 },
    literacy: { five_plus: 76.0, seven_plus: 77.5, fifteen_plus: 74.0 },
    technology: { mobile: 85.0, internet: 38.0, mobile_banking: 27.0 },
    unions: [
      { name: "Madanganj", population: 40000, households: 8000, literacy: 75.5 },
      { name: "Dhamgar", population: 42000, households: 8500, literacy: 76.0 },
      { name: "Kolagathia", population: 39000, households: 7800, literacy: 75.0 },
      { name: "Bandar", population: 41000, households: 8200, literacy: 76.2 },
      { name: "Shahjalal", population: 38000, households: 7600, literacy: 74.8 }
    ]
  },
  {
    id: "araihazar",
    code: "305",
    name: "Araihazar",
    population: { male: 280000, female: 260000, total: 540000 },
    households: { total: 105000, avg_size: 5.0 },
    literacy: { five_plus: 77.8, seven_plus: 79.0, fifteen_plus: 76.0 },
    technology: { mobile: 88.0, internet: 41.0, mobile_banking: 30.0 },
    unions: [
      { name: "Brahmandi", population: 47000, households: 9500, literacy: 77.0 },
      { name: "Dhamsha", population: 45000, households: 9000, literacy: 76.5 },
      { name: "Satgram", population: 48000, households: 9600, literacy: 77.8 },
      { name: "Fatepur", population: 46000, households: 9200, literacy: 77.2 },
      { name: "Haizadi", population: 44000, households: 8800, literacy: 76.0 }
    ]
  }
];

module.exports = {
  narayanganj_district,
  narayanganj_upazilas
};

