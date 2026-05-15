/* ═══════════════════════════════════════════════════════════════
   PHC 2022 — MAIN REGISTRY & INDICATORS
   ═══════════════════════════════════════════════════════════════ */

const PHC_INDICATOR_INDEX = [
  {key:"pop_total_2022", bn:"মোট জনসংখ্যা", en:"Total Population", cat:"জনসংখ্যা", unit:"জন"},
  {key:"pop_male_2022", bn:"পুরুষ জনসংখ্যা", en:"Male Population", cat:"জনসংখ্যা", unit:"জন"},
  {key:"pop_female_2022", bn:"মহিলা জনসংখ্যা", en:"Female Population", cat:"জনসংখ্যা", unit:"জন"},
  {key:"growth_rate_2022", bn:"বৃদ্ধির হার", en:"Growth Rate", cat:"জনসংখ্যা", unit:"%"},
  {key:"sex_ratio_2022", bn:"লিঙ্গানুপাত", en:"Sex Ratio", cat:"জনসংখ্যা", unit:"প্রতি ১০০ মহিলায় পুরুষ"},
  {key:"literacy_total_2022", bn:"সাক্ষরতার হার", en:"Literacy Rate", cat:"শিক্ষা", unit:"%"},
  {key:"electricity_grid_pct", bn:"গ্রিড বিদ্যুৎ", en:"Grid Electricity", cat:"বিদ্যুৎ", unit:"%"},
  {key:"internet_pct", bn:"ইন্টারনেট ব্যবহারকারী", en:"Internet Users", cat:"প্রযুক্তি", unit:"%"},
  {key:"sdg_sanitation", bn:"SDG স্যানিটেশন", en:"SDG Sanitation", cat:"SDG সূচক", unit:"%"},
  {key:"sdg_internet", bn:"SDG ইন্টারনেট", en:"SDG Internet", cat:"SDG সূচক", unit:"%"},
];

const PHC_DISTRICT_REGISTRY = [
  {
    id: "coxsbazar",
    name_bn: "কক্সবাজার",
    name_en: "Cox's Bazar",
    code: "10",
    division_bn: "চট্টগ্রাম",
    available: true,
    color: "#1565C0",
    icon: "🏖️",
    pop_total_2022: 2823268,
    upazila_count: 9,
    data_obj: "PHC_DISTRICT_COXSBAZAR",
    upazilas_obj: "PHC_UPAZILAS_COXSBAZAR",
    unions_obj: "PHC_UNIONS_COXSBAZAR",
    script_path: "js/districts/phc_data_coxsbazar.js" // ফাইলের লোকেশন
  },
  {
    id: "chittagong",
    name_bn: "চট্টগ্রাম",
    name_en: "Chattogram",
    code: "15",
    division_bn: "চট্টগ্রাম",
    available: true,
    color: "#B71C1C",
    icon: "⚓",
    pop_total_2022: 9169465,
    upazila_count: 16,
    data_obj: "PHC_DISTRICT_CHATTOGRAM",
    upazilas_obj: "PHC_UPAZILAS_CHATTOGRAM",
    script_path: "js/districts/phc_data_chittagong.js" // এটি পরে যুক্ত করবেন
  }
];

