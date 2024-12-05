// Import and initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-storage.js";

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

// Initialize db1, db2, and storage
const app1 = initializeApp(firebaseConfig1, 'db1');
const app2 = initializeApp(firebaseConfig2, 'db2');
const db1 = getDatabase(app1);
const db2 = getDatabase(app2);
const storage = getStorage(app2);

// Function to upload an image to Firebase Storage
async function uploadImage(file) {
    const storagePath = `images/${file.name}`;
    const storageReference = storageRef(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageReference, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {},
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}

// Function to update redeem status in db1 with image URL
async function updateRedeemStatus(redeemCode, status, imageUrl = null) {
    redeemCode = redeemCode.replace(/\s+/g, '').trim();
    const statusValue = parseInt(status, 10);

    if (!redeemCode || !statusValue || (statusValue !== 1 && statusValue !== 2 && statusValue !== 3)) {
        alert("Please enter valid values.");
        return;
    }

    try {
        const redeemRef = ref(db1, "redeem/" + redeemCode);
        await set(redeemRef, {
            redeemCode,
            status: statusValue,
            imageUrl: imageUrl || ""
        });

        alert("Redeem code status updated successfully.");
    } catch (error) {
        console.error("Error updating redeem status:", error);
        alert("Failed to update redeem status.");
    }
}

// Add event listener to the file upload section
document.getElementById('upload-container').addEventListener('click', () => {
    document.getElementById('image-upload').click();
});

document.getElementById('image-upload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const imageUrl = await uploadImage(file);
        console.log('Image uploaded successfully. Image URL:', imageUrl);
        // You can now use this URL for the redeem code update
    }
});

// Button event listener for updating redeem status
document.getElementById('update-status-btn').addEventListener('click', async () => {
    const redeemCode = document.getElementById('redeem-code').value;
    const status = document.getElementById('status').value;

    // Upload image and update redeem status with image URL
    const imageUrl = document.getElementById('image-upload').files[0]
        ? await uploadImage(document.getElementById('image-upload').files[0])
        : null;

    await updateRedeemStatus(redeemCode, status, imageUrl);
});
