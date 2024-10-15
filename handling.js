// Import and initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

// Firebase configuration for db1
const firebaseConfig1 = {
  apiKey: "AIzaSyDjOqfK9295wCN3qDQmDfX7hlrpAVzWIxI",
  authDomain: "rdeem-code-453eb.firebaseapp.com",
  projectId: "rdeem-code-453eb",
  storageBucket: "rdeem-code-453eb.appspot.com",
  messagingSenderId: "923002610880",
  appId: "1:923002610880:web:c7710cc5b66bc9df2a7925",
};
// Firebase configuration for db2
const firebaseConfig2 = {
  apiKey: "AIzaSyCU3pqMPy6wlR7JObI7Y4_iZepHweQRYjo",
  authDomain: "adminpanel-ee2a0.firebaseapp.com",
  projectId: "adminpanel-ee2a0",
  storageBucket: "adminpanel-ee2a0.appspot.com",
  messagingSenderId: "396562199913",
  appId: "1:396562199913:web:8cf1358b37a529e496b9f8",
};

// Initialize db1 and db2
const app1 = initializeApp(firebaseConfig1, 'db1');
const app2 = initializeApp(firebaseConfig2, 'db2');

const db1 = getDatabase(app1);
const db2 = getDatabase(app2);

// Function to update redeem status in db1
async function updateRedeemStatus(redeemCode, status) {
    // Convert status to a number
    const statusValue = parseInt(status, 10);
    if (!redeemCode || !statusValue || (statusValue !== 1 && statusValue !== 2 && statusValue !== 3)) {
        alert("Both fields are required and status must be 1, 2, or 3.");
        return;
    }

    const dbRef = ref(db1);
    try {
        const snapshot = await get(child(dbRef, redeemCode));
        if (snapshot.exists()) {
            await update(ref(db1, redeemCode), { status: statusValue });
            location.reload();
        } else {
            alert("Redeem code not found.");
        }
    } catch (error) {
        console.error("Error updating status:", error);
        alert("An error occurred while updating the status.");
    }
}

// Function to add redeem codes in db2
async function addRedeemCodes(gameName, redeemCodes) {
    if (!gameName || redeemCodes.length === 0) {
        alert("Game name and at least one redeem code are required.");
        return;
    }

    const dbRef = ref(db2);
    try {
        const snapshot = await get(child(dbRef, gameName));
        if (snapshot.exists()) {
            // Game exists, add new redeem codes as children
            redeemCodes.forEach(async (code) => {
                await set(ref(db2, `${gameName}/${code}`), true);
            });
            location.reload();
        } else {
            // Game doesn't exist, create new game entry and add redeem codes
            const updates = {};
            redeemCodes.forEach((code) => {
                updates[code] = true;
            });
            await set(ref(db2, gameName), updates);
            location.reload();
        }
    } catch (error) {
        console.error("Error adding redeem codes:", error);
        alert("An error occurred while adding redeem codes.");
    }
}
window.addRedeemField = addRedeemField;

// Handling the Update Status button click
document.getElementById('update-status-btn').addEventListener('click', function (event) {
    event.preventDefault();
    
    const redeemCode = document.getElementById('redeem-code').value.trim();
    const status = document.getElementById('status').value.trim();

    // Call function to update status in db1
    updateRedeemStatus(redeemCode, status);
});

// Handling the Submit button for adding redeem codes
document.getElementById('submit-redeem-btn').addEventListener('click', function (event) {
    event.preventDefault();
    
    const gameName = document.getElementById('game-name').value.trim();
    const redeemCodes = Array.from(document.querySelectorAll('#add-redeem-container input[type="text"]'))
        .map(input => input.value.trim())
        .filter(code => code !== "");

    // Call function to add redeem codes to db2
    addRedeemCodes(gameName, redeemCodes);
});

// Function to dynamically add more redeem code input fields
function addRedeemField() {
    const container = document.getElementById('add-redeem-container');
    const newInputDiv = document.createElement('div');
    newInputDiv.classList.add('form-group', 'add-redeem-input');
    newInputDiv.innerHTML = `
        <input type="text" placeholder="Enter Redeem Code">
        <button type="button" onclick="addRedeemField()">+</button>
    `;
    container.appendChild(newInputDiv);
}
