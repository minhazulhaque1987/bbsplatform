/* ═══════════════════════════════════════════════════════════════
   PHC 2022 — সম্পূর্ণ জেলা রেজিস্ট্রি (22টি জেলা)
   District + Community Series Registry
   ═══════════════════════════════════════════════════════════════ */

var PHC_ALL_DISTRICTS = [
  // ── চট্টগ্রাম বিভাগ (District Series: 2টি) ──────────────────
  {
    id: "coxsbazar", name_bn: "কক্সবাজার", name_en: "Cox's Bazar",
    division_bn: "চট্টগ্রাম", code: "22", color: "#1565C0", icon: "🏖️",
    series: "district", available: true, upazila_count: 9,
    data_obj: "PHC_DISTRICT", upazilas_obj: "PHC_UPAZILAS",
  },
  {
    id: "chittagong", name_bn: "চট্টগ্রাম", name_en: "Chattogram",
    division_bn: "চট্টগ্রাম", code: "15", color: "#B71C1C", icon: "⚓",
    series: "district", available: true, upazila_count: 16,
    data_obj: "PHC_DISTRICT_CHATTOGRAM", upazilas_obj: "PHC_UPAZILAS_CHATTOGRAM",
  },

  // ── চট্টগ্রাম বিভাগ (Community Series: 11টি) ────────────────
  {
    id: "bandarban_comm", name_bn: "বান্দরবান", name_en: "Bandarban",
    division_bn: "চট্টগ্রাম", code: "03", color: "#1565C0", icon: "🏔️",
    series: "community", available: true, upazila_count: 7,
    data_obj: null, upazilas_obj: "PHC_UPAZILAS_BANDARBAN_COMM",
  },
  {
    id: "brahmanbaria_comm", name_bn: "ব্রাহ্মণবাড়িয়া", name_en: "Brahmanbaria",
    division_bn: "চট্টগ্রাম", code: "20", color: "#1565C0", icon: "🌾",
    series: "community", available: true, upazila_count: 9,
    data_obj: null, upazilas_obj: "PHC_UPAZILAS_BRAHMANBARIA_COMM",
  },
  {
    id: "chandpur_comm", name_bn: "চাঁদপুর", name_en: "Chandpur",
    division_bn: "চট্টগ্রাম", code: "13", color: "#1565C0", icon: "🐟",
    series: "community", available: true, upazila_count: 8,
    data_obj: null, upazilas_obj: "PHC_UPAZILAS_CHANDPUR_COMM",
  },
  {
    id: "chattogram_comm", name_bn: "চট্টগ্রাম", name_en: "Chattogram",
    division_bn: "চট্টগ্রাম", code: "15", color: "#1565C0", icon: "⚓",
    series: "community", available: true, upazila_count: 16,
    data_obj: null, upazilas_obj: "PHC_UPAZILAS_CHATTOGRAM_COMM",
  },
  {
    id: "coxsbazar_comm", name_bn: "কক্সবাজার", name_en: "Cox's Bazar",
    division_bn: "চট্টগ্রাম", code: "22", color: "#1565C0", icon: "🏖️",
    series: "community", available: true, upazila_count: 9,
    data_obj: null, upazilas_obj: "PHC_UPAZILAS_COXSBAZAR_COMM",
  },
  {
    id: "cumilla_comm", name_bn: "কুমিল্লা", name_en: "Cumilla",
    division_bn: "চট্টগ্রাম", code: "19", color: "#1565C0", icon: "🏭",
    series: "community", available: true, upazila_count: 18,
    data_obj: null, upazilas_obj: "PHC_UPAZILAS_CUMILLA_COMM",
  },
  {
    id: "feni_comm", name_bn: "ফেনী", name_en: "Feni",
    division_bn: "চট্টগ্রাম", code: "27", color: "#1565C0", icon: "🌊",
    series: "community", available: true, upazila_count: 6,
    data_obj: null, upazilas_obj: "PHC_UPAZILAS_FENI_COMM",
  },
  {
    id: "khagrachhari_comm", name_bn: "খাগড়াছড়ি", name_en: "Khagrachhari",
    division_bn: "চট্টগ্রাম", code: "09", color: "#1565C0", icon: "🏞️",
    series: "community", available: true, upazila_count: 9,
    data_obj: null, upazilas_obj: "PHC_UPAZILAS_KHAGRACHHARI_COMM",
  },
  {
    id: "lakshmipur_comm", name_bn: "লক্ষ্মীপুর", name_en: "Lakshmipur",
    division_bn: "চট্টগ্রাম", code: "49", color: "#1565C0", icon: "🛶",
    series: "community", available: true, upazila_count: 5,
    data_obj: null, upazilas_obj: "PHC_UPAZILAS_LAKSHMIPUR_COMM",
  },
  {
    id: "noakhali_comm", name_bn: "নোয়াখালী", name_en: "Noakhali",
    division_bn: "চট্টগ্রাম", code: "57", color: "#1565C0", icon: "🌾",
    series: "community", available: true, upazila_count: 9,
    data_obj: null, upazilas_obj: "PHC_UPAZILAS_NOAKHALI_COMM",
  },
  {
    id: "rangamati_comm", name_bn: "রাঙ্গামাটি", name_en: "Rangamati",
    division_bn: "চট্টগ্রাম", code: "86", color: "#1565C0", icon: "🏔️",
    series: "community", available: true, upazila_count: 10,
    data_obj: null, upazilas_obj: "PHC_UPAZILAS_RANGAMATI_COMM",
  },
];

// ── State variables are declared in phc_multi_district.js ────
