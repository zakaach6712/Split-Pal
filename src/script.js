const people = [];

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

  setStep(2); // 📍 Moved to final step
  resultDiv.innerHTML = "<h3>Who Owes What:</h3>";
  people.forEach(person => {
    resultDiv.innerHTML += `<p>${person.name} owes $${person.amount.toFixed(2)}</p>`;
  });

  // 📤 WhatsApp Integration
  const summary = people
    .map(p => `${p.name} owes $${p.amount.toFixed(2)}`)
    .join('\n');

  const encodedMessage = encodeURIComponent(
    `Hey everyone!\nHere's our SplitPal summary:\n\n${summary}`
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

// 🔄 Step Tracker Logic
function setStep(index) {
  const steps = document.querySelectorAll('.step');
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
  });
}
