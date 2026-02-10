// --- CONFIGURATION ---
const UPI_ID = "YOURNAME@upi"; // <--- CHANGE THIS
const DISCORD_WEBHOOK = "YOUR_WEBHOOK_URL"; // <--- CHANGE THIS

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
                { name: "Price", value: "₹"+amt, inline: true },
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
        alert("Success! Owner will verify and activate your plan.");
        closeModal();
    } catch (e) {
        alert("Notification failed! Check Webhook.");
    }
}