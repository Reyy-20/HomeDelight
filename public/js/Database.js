// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to add a new card to the dashboard
export async function addCard(cardData) {
    try {
        const docRef = await addDoc(collection(db, "dashboard_cards"), {
            title: cardData.title,
            price: cardData.price,
            date: cardData.date,
            imageUrl: cardData.imageUrl, // Store the image URL
            description: cardData.description || '',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        console.log("Property added successfully with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding property: ", error);
        throw error;
    }
}

// Function to get all cards from the dashboard
export async function getAllCards() {
    try {
        const querySnapshot = await getDocs(collection(db, "dashboard_cards"));
        const cards = [];
        querySnapshot.forEach((doc) => {
            cards.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return cards;
    } catch (error) {
        console.error("Error getting properties: ", error);
        throw error;
    }
}

// Function to delete a card
export async function deleteCard(cardId) {
    try {
        await deleteDoc(doc(db, "dashboard_cards", cardId));
        console.log("Property deleted successfully");
    } catch (error) {
        console.error("Error deleting property: ", error);
        throw error;
    }
}

// Function to update a card
export async function updateCard(cardId, cardData) {
    try {
        const cardRef = doc(db, "dashboard_cards", cardId);
        await updateDoc(cardRef, {
            ...cardData,
            updatedAt: new Date()
        });
        console.log("Property updated successfully");
    } catch (error) {
        console.error("Error updating property: ", error);
        throw error;
    }
}

// Function to render cards in the dashboard
export function renderCards(cards, containerSelector = '.cards-grid') {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error("Container not found");
        return;
    }

    container.innerHTML = '';

    cards.forEach(card => {
        const cardElement = createCardElement(card);
        container.appendChild(cardElement);
    });
}

// Function to create a card element
function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.dataset.cardId = card.id;
    
    // Handle both old base64 images and new URLs
    const imageSource = card.imageUrl || card.image || '';
    
    cardDiv.innerHTML = `
        <div class="card-image" style="background-image: url('${imageSource}');">
        </div>
        <div class="card-content">
            <h3 class="card-title">${card.title}</h3>
            <div class="card-price">$${card.price.toFixed(2)}</div>
            <p class="card-date">${card.date}</p>
            ${card.description ? `<p class="card-description">${card.description}</p>` : ''}
            <button class="delete-card-btn" onclick="deleteCardFromUI('${card.id}')">Delete</button>
        </div>
    `;

    return cardDiv;
}

// Global function to delete card from UI (needs to be global for onclick)
window.deleteCardFromUI = async function(cardId) {
    try {
        await deleteCard(cardId);
        // Refresh the cards display
        const cards = await getAllCards();
        renderCards(cards);
    } catch (error) {
        console.error("Error deleting property from UI: ", error);
    }
};

// Function to load and display cards when dashboard loads
export async function loadDashboardCards() {
    try {
        const cards = await getAllCards();
        renderCards(cards);
    } catch (error) {
        console.error("Error loading dashboard properties: ", error);
    }
}
