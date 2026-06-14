plugins {
    // আগের প্লাগইনগুলো থাকবে...
    id("com.google.gms.google-services") version "7.7.5" apply false
    
    // অ্যাপ ডিস্ট্রিবিউশন প্লাগইন যোগ করুন
    id("com.google.firebase.appdistribution") version "5.1.0" apply false
}