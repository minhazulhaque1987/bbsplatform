
const premiumGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #2af598 0%, #009efd 100%)',
  'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, rgb(45, 78, 72) 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
];

const items = document.querySelectorAll('.dash-mod-grid > .dash-mod');
let rotationStep = 0;

function rotatePremiumColors() {
  rotationStep++;
  items.forEach((el, index) => {
    const gradient = premiumGradients[(index + rotationStep) % premiumGradients.length];
    el.style.background = gradient;
  });
}

// প্রতি ৩ সেকেন্ড পর পর কালার পরিবর্তন
setInterval(rotatePremiumColors, 30000);

// পেজ লোড হওয়ার সাথে সাথেই প্রথমবার কালার সেট করা
rotatePremiumColors();