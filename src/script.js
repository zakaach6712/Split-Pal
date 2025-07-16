const people = [];
let exchangeRate = 150; // Default fallback: 1 USD = 150 KES
let rateDate = "Unknown date";

function recordPerson() {
  const nameInput = document.getElementById("singleName");
  const amountInput = document.getElementById("singleAmount");

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!name || isNaN(amount)) {
    alert("Please enter both a name and a valid amount.");
    return;
  }

  people.push({ name, amount });

  nameInput.value = "";
  amountInput.value = "";
}

function showSummary() {
  const total = parseFloat(document.getElementById("totalBill").value);
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (isNaN(total)) {
    resultDiv.innerHTML = `<p style="color:red;">Please enter a valid total bill first.</p>`;
    document.getElementById('share-whatsapp').style.display = 'none';
    return;
  }

  const totalAssigned = people.reduce((sum, p) => sum + p.amount, 0);

  if (totalAssigned !== total) {
    resultDiv.innerHTML = `<p style="color:red;">Total assigned (${totalAssigned}) doesn’t match bill (${total}).</p>`;
    document.getElementById('share-whatsapp').style.display = 'none';
    return;
  }

  setStep(2);
  resultDiv.innerHTML = "<h3>Who Owes What:</h3>";
  people.forEach(person => {
    const amountKES = (person.amount * exchangeRate).toFixed(2);
    resultDiv.innerHTML += `<p>${person.name} owes $${person.amount.toFixed(2)} (~Ksh ${amountKES})</p>`;
  });

  const summary = people
    .map(p => `${p.name} owes $${p.amount.toFixed(2)} (~Ksh ${(p.amount * exchangeRate).toFixed(2)})`)
    .join('\n');

  const encodedMessage = encodeURIComponent(
    `Hey everyone!\nHere's our SplitPal summary:\n\n${summary}\n\nExchange Rate: 1 USD = ${exchangeRate} KES\nDate: ${rateDate}`
  );

  const whatsappLink = `https://wa.me/?text=${encodedMessage}`;
  const shareBtn = document.getElementById('share-whatsapp');
  shareBtn.style.display = 'inline-block';
  shareBtn.onclick = () => {
    window.open(whatsappLink, '_blank');
  };
}

function goToPage(pageId) {
  document.getElementById('homePage').style.display = 'none';
  document.getElementById('summaryPage').style.display = 'block';
  setStep(2);
}


function setStep(index) {
  const steps = document.querySelectorAll('.step');
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
  });
}
async function fetchExchangeRate(base = 'USD', target = 'KES') {
  const apiKey = '2b1f90cce62f5d36005002fa';
  const endpoint = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${base}/${target}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    console.log("ExchangeRate-API response:", data);

    if (data.result !== "success" || typeof data.conversion_rate === 'undefined') {
      console.warn(`⚠️ ExchangeRate-API failed or missing conversion rate. Falling back to ${exchangeRate} KES.`);
      document.getElementById("exchangeRate").textContent =
        `1 ${base} ≈ ${exchangeRate} ${target} (fallback rate used)`;
      return;
    }

    exchangeRate = data.conversion_rate;
    rateDate = data.time_last_update_utc || "Unknown date";

    document.getElementById("exchangeRate").textContent =
      `1 ${base} = ${exchangeRate} ${target} (as of ${new Date(rateDate).toLocaleDateString()})`;
  } catch (err) {
    console.error("Using fallback rate due to error:", err);
    document.getElementById("exchangeRate").textContent =
      `1 ${base} ≈ ${exchangeRate} ${target} (fallback rate used)`;
  }
}



document.addEventListener("DOMContentLoaded", () => fetchExchangeRate("USD", "KES"));

