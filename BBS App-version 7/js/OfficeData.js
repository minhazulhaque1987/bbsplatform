// ১. আপনার ডাটা বা অপশনগুলোর লিস্ট (এটি ডাটাবেজ থেকেও আসতে পারে)
const officeData = [
    "চট্টগ্রাম জেলা পরিসংখ্যান অফিস",
    "ঢাকা জেলা পরিসংখ্যান অফিস",
    "রাজশাহী জেলা পরিসংখ্যান অফিস",
    "সিলেট জেলা পরিসংখ্যান অফিস",
    "বরিশাল জেলা পরিসংখ্যান অফিস"
];

// ২. ইনপুট এলিমেন্টটি সিলেক্ট করা
const inputField = document.getElementById('s-office');

// ৩. একটি নতুন <datalist> এলিমেন্ট তৈরি করা
const dataList = document.createElement('datalist');
dataList.id = 'dynamic-office-list';

// ৪. লুপ চালিয়ে অপশনগুলো ডাটালিস্টে যোগ করা
officeData.forEach(office => {
    const option = document.createElement('option');
    option.value = office;
    dataList.appendChild(option);
});

// ৫. ডাটালিস্টটি বডিতে বা ইনপুটের পাশে যোগ করা
document.body.appendChild(dataList);

// ৬. ইনপুট ফিল্ডের সাথে ডাটালিস্টটি কানেক্ট করা
inputField.setAttribute('list', 'dynamic-office-list');