// --- CONFIGURATION ---
const UPI_ID = "yojashvrajput9@oksbi"; 
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1470833145397116950/faLy_SQyg38KY1sKe_Frk4KuAZzlqZI0FdsAT26YAD0gHA8gAKRj8E55BqDY1lNjjZ14";

let amt = 0;
let plan = "";

function openPayment(price, name) {
    amt = price;
    plan = name;
    document.getElementById('selected-info').innerText = `${name} - ₹${price}`;
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${UPI_ID}%26am=${price}%26cu=INR%26tn=QuestBot_Order`;
    document.getElementById('qr-display').src = qr;
    document.getElementById('paymentModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('paymentModal').classList.add('hidden');
    const btn = document.getElementById('submitBtn');
    btn.disabled = false;
    btn.innerText = "Submit Payment";
}

async function submitOrder() {
    const btn = document.getElementById('submitBtn');
    const user = document.getElementById('discord-user').value.trim();
    const txn = document.getElementById('transaction-id').value.trim();

    if(!user) return alert("Please enter Discord ID");
    if(txn.length < 10 || txn.length > 20) return alert("Invalid Transaction ID! Enter 10-20 digits.");

    // Double-click protection
    btn.disabled = true;
    btn.innerText = "Processing...";

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
            footer: { text: "Manual Verification Required" },
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
            alert('Success! Please wait 10-15 mins for activation.');
            closeModal();
        }
    } catch (e) {
        alert('Error sending order. Try again.');
        btn.disabled = false;
        btn.innerText = "Submit Payment";
    }
}

// ORDER TRACKING LOGIC
async function checkStatus() {
    const input = document.getElementById('status-input').value.trim().toLowerCase();
    const resultDiv = document.getElementById('status-result');
    
    if (!input) return alert("Enter Discord ID to track!");

    try {
        const response = await fetch('https://raw.githubusercontent.com/yojashv/Quest-site/main/status.json');
        const data = await response.json();
        const order = data.find(o => o.id.toLowerCase() === input);

        resultDiv.classList.remove('hidden');
        if (order) {
            resultDiv.innerHTML = `
                <div class="flex flex-col gap-1">
                    <p class="text-sm text-gray-400 uppercase font-bold">Status Update</p>
                    <p class="text-white text-lg font-bold">${order.status}</p>
                    <p class="text-gray-400 text-xs">Plan: ${order.plan}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<p class="text-red-400">❌ No active order found for "${input}".</p>`;
        }
    } catch (e) {
        alert("Could not load status. Make sure status.json exists!");
    }
}

async function loadLiveQuests() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/yojashv/Quest-site/main/quests.json');
        const quests = await response.json();
        const container = document.getElementById('quest-data');
        if(quests && quests.length > 0) {
            container.innerHTML = quests.map(q => `
                <div class="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                    <span class="font-bold text-white">${q.name}</span>
                    <span class="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded uppercase">${q.platform}</span>
                </div>
            `).join('');
        }
    } catch (e) { console.log("Quests loading failed"); }
}

loadLiveQuests();
