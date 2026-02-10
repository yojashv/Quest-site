// --- CONFIGURATION ---
const UPI_ID = "yojashvrajput9@oksbi"; // Aapki verified UPI ID
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1470833145397116950/faLy_SQyg38KY1sKe_Frk4KuAZzlqZI0FdsAT26YAD0gHA8gAKRj8E55BqDY1lNjjZ14";

let amt = 0;
let plan = "";

// 1. Modal aur QR Code kholne ka function
function openPayment(price, name) {
    amt = price;
    plan = name;
    document.getElementById('selected-info').innerText = `${name} - ₹${price}`;

    // Dynamic QR Generator
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${UPI_ID}%26am=${price}%26cu=INR%26tn=QuestBot_Order`;
    document.getElementById('qr-display').src = qr;

    document.getElementById('paymentModal').classList.remove('hidden');
}

// 2. Modal band karne ka function
function closeModal() {
    document.getElementById('paymentModal').classList.add('hidden');
    // Button ko wapas reset karein agar band kiya jaye
    const submitBtn = document.querySelector('button[onclick="submitOrder()"]');
    if(submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Payment";
    }
}

// 3. Order submit karne ka function (Double Click Protection ke sath)
async function submitOrder() {
    const submitBtn = document.querySelector('button[onclick="submitOrder()"]');
    const user = document.getElementById('discord-user').value;
    const txn = document.getElementById('transaction-id').value;

    // Validation: Discord User aur 10-20 digit ki TXN ID
    if(!user) return alert("Apna Discord Username dalo!");
    if(txn.length < 10 || txn.length > 20) return alert("Wrong/Write valid Transaction ID (10-20 digits)!");

    // Button ko disable karein taaki duplicate order na jaye
    submitBtn.disabled = true;
    submitBtn.innerText = "Processing...";

    const payload = {
        embeds: [{
            title: "💎 NEW PREMIUM ORDER",
            color: 5793266,
            fields: [
                { name: "Plan", value: plan, inline: true },
                { name: "Price", value: "₹" + amt, inline: true },
                { name: "Discord ID", value: user },
                { name: "TXN ID", value: `\`${txn}\`` }
            ],
            footer: { text: "Verify payment before activating!" },
            timestamp: new Date()
        }]
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Success! Order received. Owner will verify soon.');
            closeModal();
        } else {
            throw new Error("Webhook error");
        }
    } catch (e) {
        alert('Notification failed! Check connection or Webhook.');
        submitBtn.disabled = false; // Error aaye toh button wapas enable karein
        submitBtn.innerText = "Submit Payment";
    }
}

// 4. Live Quests load karne ka function
async function loadLiveQuests() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/yojashv/Quest-site/main/quests.json');
        const quests = await response.json();
        
        const container = document.getElementById('quest-data');
        if(quests && quests.length > 0) {
            container.innerHTML = quests.map(q => `
                <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:8px; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 5px;">
                    <span style="color:white; font-weight:bold;">${q.name}</span>
                    <span style="color:#5865f2; font-size:12px;">${q.platform}</span>
                </div>
            `).join('');
            
            const spinner = document.querySelector('.fa-spin') || document.querySelector('.fa-spinner');
            if(spinner) spinner.style.display = 'none';
        }
    } catch (error) {
        console.log("Quests load nahi ho paye.");
    }
}

// Initial Call
loadLiveQuests();
