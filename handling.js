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

// Function to update redeem status in db1 with timestamp
async function updateRedeemStatus(redeemCode, status) {
    // Clean the redeem code by trimming and removing all spaces
    redeemCode = redeemCode.replace(/\s+/g, '').trim();

    // Convert status to a number
    const statusValue = parseInt(status, 10);
    
    // Ensure status is 1, 2, or 3, and redeemCode is not empty
    if (!redeemCode || !statusValue || (statusValue !== 1 && statusValue !== 2 && statusValue !== 3)) {
        alert("Both fields are required and status must be 1, 2, or 3.");
        return;
    }

    const dbRef = ref(db1, redeemCode);
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const updates = {
                status: statusValue,
            };

            // If status is 2, add 'processing' timestamp
            if (statusValue === 2) {
                updates.processed = Date.now(); // Add 'processing' timestamp
            }

            // If status is 3, add 'completed' timestamp
            if (statusValue === 3) {
                updates.completed = Date.now(); // Add 'completed' timestamp
            }

            // Update status and timestamp in the database
            await update(dbRef, updates);
            console.log('Status updated successfully');
            location.reload(); // Reload page after updating
        } else {
            alert("Redeem code not found.");
        }
    } catch (error) {
        console.error("Error updating status:", error);
        alert("An error occurred while updating the status.");
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
