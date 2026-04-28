
async function login(){
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('http://localhost:5000/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({email,password})
  });

  const data = await res.json();
  alert(data.message);
}


const app = {
    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        setTimeout(() => this.showAuth(), 2000);
    },

    // ভিউ পরিবর্তন করার সময় সংশ্লিষ্ট মডিউল কল করা
    goView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');

        // ভিউ অনুযায়ী ডাটা লোড করা
        if (viewId === 'v-manpower') manpowerManager.renderList();
        if (viewId === 'v-admin') adminManager.renderPendingRequests();
    },
    
    updateClock() {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString('bn-BD', { hour12: false });
    }
};

window.onload = () => app.init();

// ১. আপনার তৈরি করা JSON ফাইলটি ফেচ (Fetch) করা
fetch('bbs_offices_complete.json') // নিশ্চিত করুন ফাইলটি একই ফোল্ডারে আছে
    .then(response => response.json())
    .then(data => {
        const datalist = document.getElementById('office-list');
        
        // সদর দপ্তর (Wings) যোগ করা
        data.headquarters.forEach(wing => {
            let option = document.createElement('option');
            option.value = `${wing.bn} (${wing.en})`;
            datalist.appendChild(option);
        });

        // বিভাগ, জেলা ও উপজেলা অনুযায়ী লুপ চালিয়ে সব অফিস যোগ করা
        data.divisions.forEach(div => {
            div.districts.forEach(dist => {
                // জেলা অফিস যোগ করা
                let distOption = document.createElement('option');
                distOption.value = `জেলা পরিসংখ্যান অফিস, ${dist.district_bn}`;
                datalist.appendChild(distOption);

                // ওই জেলার সব উপজেলা অফিস যোগ করা
                dist.upazilas.forEach(upz => {
                    let upzOption = document.createElement('option');
                    upzOption.value = `উপজেলা পরিসংখ্যান অফিস, ${upz.bn}, ${dist.district_bn}`;
                    datalist.appendChild(upzOption);
                });
            });
        });
    })
    .catch(error => console.error('Error loading office data:', error));