// --- CONFIGURATION ---
const UPI_ID = "YOURNAME@upi"; // <--- Yahan apni UPI ID daalein
const DISCORD_WEBHOOK = "YOUR_WEBHOOK_URL"; // <--- Yahan apna Discord Webhook URL paste karein

let amt = 0;
let plan = "";

function openPayment(price, name) {
    amt = price;
    plan = name;
    document.getElementById('selected-info').innerText = `${name} - ₹${price}`;

    // Dynamic QR Generator
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${UPI_ID}%26am=${price}%26cu=INR%26tn=QuestBot_Order`;
    document.getElementById('qr-display').src = qr;

    document.getElementById('paymentModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('paymentModal').classList.add('hidden');
}

async function submitOrder() {
    const user = document.getElementById('discord-user').value;
    const txn = document.getElementById('transaction-id').value;

    if(!user || txn.length < 10) return alert("Sahi details dalo!");

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
            timestamp: new Date()
        }]
    };

    try {
        await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        alert('Success! Owner will verify and activate your plan.');
        closeModal();
    } catch (e) {
        alert('Notification failed! Check Webhook.');
    }
}

async function loadLiveQuests() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/yojashv/Quest-site/main/quests.json');
        const quests = await response.json();
        
        const container = document.getElementById('quest-data');
        if(quests.length > 0) {
            container.innerHTML = quests.map(q => `
                <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:8px; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 5px;">
                    <span style="color:white; font-weight:bold;">${q.name}</span>
                    <span style="color:#5865f2; font-size:12px;">${q.platform}</span>
                </div>
            `).join('');
            
            // Loading spinner hatane ke liye
            const spinner = document.querySelector('.fa-spin') || document.querySelector('.fa-spinner');
            if(spinner) spinner.style.display = 'none';
        }
    } catch (error) {
        console.log("Quests load nahi ho paye.");
    }
}

// Website load hote hi quests dikhao
loadLiveQuests();
