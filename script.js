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
async function loadLiveQuests() {
    try {
        // Apne GitHub Username aur Repo ka naam yahan badlein
        const response = await fetch('https://raw.githubusercontent.com/yojashv/Quest-site/main/quests.json');
        const quests = await response.json();
        
        if(quests.length > 0) {
            container.innerHTML = quests.map(q => `
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:10px; background:#1c2129; padding:12px; border-radius:10px; border: 1px solid #30363d;">
                    <div>
                        <span style="color:white; font-weight:bold; display:block; font-size:14px;">${q.name}</span>
                        <span style="color:#5865f2; font-size:11px; text-transform:uppercase; letter-spacing:1px;">${q.platform}</span>
                    </div>
                    <a href="${q.link || '#'}" target="_blank" style="background:#5865f2; color:white; padding:8px 16px; border-radius:6px; text-decoration:none; font-size:12px; font-weight:bold; transition: 0.2s;" onmouseover="this.style.background='#4752c4'" onmouseout="this.style.background='#5865f2'">
                        Go to Quest <i class="fas fa-external-link-alt" style="font-size:10px; margin-left:5px;"></i>
                    </a>
                </div>
            `).join('');
        }
    } catch (error) {
        console.log("Quests load nahi ho paye.");
    }
}

// Website load hote hi quests dikhao
loadLiveQuests();
