// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Firebase configuration
const firebaseConfig1 = {
    apiKey: "AIzaSyDjOqfK9295wCN3qDQmDfX7hlrpAVzWIxI",
    authDomain: "rdeem-code-453eb.firebaseapp.com",
    projectId: "rdeem-code-453eb",
    storageBucket: "rdeem-code-453eb.appspot.com",
    messagingSenderId: "923002610880",
    appId: "1:923002610880:web:c7710cc5b66bc9df2a7925"
};

const firebaseConfig2 = {
    apiKey: "AIzaSyCU3pqMPy6wlR7JObI7Y4_iZepHweQRYjo",
    authDomain: "adminpanel-ee2a0.firebaseapp.com",
    projectId: "adminpanel-ee2a0",
    storageBucket: "adminpanel-ee2a0.appspot.com",
    messagingSenderId: "396562199913",
    appId: "1:396562199913:web:8cf1358b37a529e496b9f8"
};

// Initialize Firebase
let app1, app2;

try {
    app1 = initializeApp(firebaseConfig1, "app1");
} catch (error) {
    if (error.code !== 'app/duplicate-app') {
        console.error('Error initializing app1:', error);
    }
}

try {
    app2 = initializeApp(firebaseConfig2, "app2");
} catch (error) {
    if (error.code !== 'app/duplicate-app') {
        console.error('Error initializing app2:', error);
    }
}

const db1 = getDatabase(app1);
const db2 = getDatabase(app2);

// Function to fetch and display data from both databases
function loadGameData() {
    const gamesAccordion = document.getElementById('games-accordion');

    // Reference to the games in database 2
    const gamesRef = ref(db2, '/');
    onValue(gamesRef, (snapshot) => {
        gamesAccordion.innerHTML = ''; // Clear previous content
        console.log("Games fetched from database 2:");

        snapshot.forEach((gameSnapshot) => {
            const gameName = gameSnapshot.key;
            console.log(`Processing game: ${gameName}`); // Log game name

            // Create accordion item for each game
            const accordionItem = document.createElement('div');
            accordionItem.classList.add('accordion-item');

            const accordionButton = document.createElement('button');
            accordionButton.classList.add('accordion-button');
            accordionButton.innerText = gameName;

            // Create accordion content
            const accordionContent = document.createElement('div');
            accordionContent.classList.add('accordion-content');

            // Fetch redeem codes (tables) from database 2
            const redeemCodesRef = ref(db2, `${gameName}/`);
            onValue(redeemCodesRef, (redeemSnapshot) => {
                console.log(`Fetching redeem codes (tables) for: ${gameName}`);

                if (redeemSnapshot.exists()) {
                    redeemSnapshot.forEach((codeSnapshot) => {
                        const redeemCode = codeSnapshot.key; // Treat table name as redeem code
                        console.log(`Redeem Code (Table): ${redeemCode}`);

                        // Create redeem code item
                        const redeemCodeItem = document.createElement('div');
                        redeemCodeItem.classList.add('redeem-code-item');

                        const codeSpan = document.createElement('span');
                        codeSpan.innerText = redeemCode; // Redeem code (table name)
                        codeSpan.style.color = 'white'; // Set redeem code text to white

                        // Check for redeem code status in db1
                        const statusSpan = document.createElement('span');
                        const redeemCodeStatusRef = ref(db1, `/${redeemCode}`); // db1 stores redeem codes as table names
                        onValue(redeemCodeStatusRef, (statusSnapshot) => {
                            if (statusSnapshot.exists()) {
                                statusSpan.innerText = 'Active'; // Status is active
                                statusSpan.style.color = 'green'; // Set status color to green
                            } else {
                                statusSpan.innerText = 'Not Active'; // Status is not active
                                statusSpan.style.color = 'red'; // Set status color to red
                            }
                        });

                        // Delete button
                        const deleteButton = document.createElement('button');
                        deleteButton.classList.add('delete');
                        deleteButton.innerText = 'Delete';
                        deleteButton.style.backgroundColor = 'red';
                        deleteButton.style.color = 'white';
                        deleteButton.style.marginRight = '10px'; // Space between Delete and Track buttons

                        // Track button
                        const trackLink = document.createElement('a');
                        trackLink.classList.add('track');
                        trackLink.href = 'https://psnadminpanel346.github.io/track_trace/'; // Update this with the desired link
                        trackLink.innerText = 'Track';

                        // Add click event to the delete button
                        deleteButton.onclick = () => {
                            const confirmDelete = confirm(`Are you sure you want to delete the redeem code: ${redeemCode}?`);
                            if (confirmDelete) {
                                // Delete the redeem code from database
                                const redeemCodeDeleteRef = ref(db2, `${gameName}/${redeemCode}`);

                                // Debugging line
                                console.log('Attempting to delete:', redeemCodeDeleteRef);

                                // Call the remove function directly from the import
                                remove(redeemCodeDeleteRef)
                                    .then(() => {
                                        console.log(`${redeemCode} deleted successfully.`);
                                        redeemCodeItem.remove(); // Remove from the UI
                                    })
                                    .catch((error) => {
                                        console.error(`Error deleting ${redeemCode}:`, error);
                                    });
                            }
                        };

                        // Append the buttons in the desired order: Delete then Track
                        redeemCodeItem.appendChild(codeSpan);
                        redeemCodeItem.appendChild(statusSpan);
                        redeemCodeItem.appendChild(deleteButton); // Delete button first
                        redeemCodeItem.appendChild(trackLink);  // Then Track button
                        accordionContent.appendChild(redeemCodeItem);
                    });
                } else {
                    console.log(`No redeem codes found for: ${gameName}`); // Log if no redeem codes found
                }

                // Add click event to toggle accordion content
                accordionButton.onclick = () => {
                    accordionContent.classList.toggle('active');
                    // Adjust the max-height for smooth toggle
                    if (accordionContent.classList.contains('active')) {
                        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
                    } else {
                        accordionContent.style.maxHeight = "0";
                    }
                };

                accordionItem.appendChild(accordionButton);
                accordionItem.appendChild(accordionContent);
                gamesAccordion.appendChild(accordionItem);
            });
        });
    });
}

// Load game data on page load
window.onload = loadGameData;
