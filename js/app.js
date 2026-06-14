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
        console.log('App initializing...');
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        // Session restore is now handled by data.js
        // No duplicate navigation logic needed here
    },

    updateClock() {
        const clockEl = document.getElementById('clock');
        if (clockEl) {
            const now = new Date();
            clockEl.innerText = now.toLocaleTimeString('bn-BD', { hour12: false });
        }
    }
};

window.onload = () => app.init();

// অফিস ডাটা লোড করা
document.addEventListener('DOMContentLoaded', () => {
    // Try to load office data from JSON file (only works on http://)
    fetch('js/bbs_offices_complete.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const datalist = document.getElementById('office-list');
            if (!datalist) {
                console.log('Office list element not found, skipping office JSON load.');
                return;
            }
            
            // সদর দপ্তর (Wings) যোগ করা
            if (data.headquarters) {
                data.headquarters.forEach(wing => {
                    let option = document.createElement('option');
                    option.value = `${wing.bn} (${wing.en})`;
                    datalist.appendChild(option);
                });
            }

            // বিভাগ, জেলা ও উপজেলা অনুযায়ী লুপ চালিয়ে সব অফিস যোগ করা
            if (data.divisions) {
                data.divisions.forEach(div => {
                    if (div.districts) {
                        div.districts.forEach(dist => {
                            // জেলা অফিস যোগ করা
                            let distOption = document.createElement('option');
                            distOption.value = `জেলা পরিসংখ্যান অফিস, ${dist.district_bn}`;
                            datalist.appendChild(distOption);

                            // ওই জেলার সব উপজেলা অফিস যোগ করা
                            if (dist.upazilas) {
                                dist.upazilas.forEach(upz => {
                                    let upzOption = document.createElement('option');
                                    upzOption.value = `উপজেলা পরিসংখ্যান অফিস, ${upz.bn}, ${dist.district_bn}`;
                                    datalist.appendChild(upzOption);
                                });
                            }
                        });
                    }
                });
            }
            console.log('✅ Office data loaded from JSON file');
        })
        .catch(error => {
            // Fallback: office data already available in bbs_offices_data.js
            console.log('ℹ️  Office JSON fetch skipped (works on http:// only)');
            console.log('ℹ️  Using bbs_offices_data.js for office autocomplete instead');
            
            // bbs_offices_data.js থেকে data available আছে কিনা চেক করুন
            if (typeof bbsOffices !== 'undefined' && bbsOffices.length > 0) {
                console.log('✅ Office autocomplete ready from bbs_offices_data.js');
            }
        });
});