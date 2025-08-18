// Database operations for Home Delight
// This file uses Firebase compat version for better compatibility

// Function to add a new card to the dashboard
export async function addCard(cardData) {
    try {
        // Check if user is authenticated
        if (!window.authManager || !window.authManager.currentUser) {
            throw new Error('User must be authenticated to add properties');
        }

        const docRef = await window.db.collection("properties").add({
            title: cardData.title,
            price: cardData.price,
            contactNumber: cardData.contactNumber,
            date: cardData.date,
            imageUrl: cardData.imageUrl,
            description: cardData.description || '',
            userId: window.authManager.currentUser.uid, // Associate with current user
            businessEmail: window.authManager.currentUser.email,
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

// Function to get all cards from the dashboard (public access)
export async function getAllCards() {
    try {
        const querySnapshot = await window.db.collection("properties").orderBy("createdAt", "desc").get();
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

// Function to get user's own properties
export async function getUserProperties() {
    try {
        if (!window.authManager || !window.authManager.currentUser) {
            throw new Error('User must be authenticated to view their properties');
        }

        const querySnapshot = await window.db.collection("properties")
            .where("userId", "==", window.authManager.currentUser.uid)
            .orderBy("createdAt", "desc")
            .get();
        
        const cards = [];
        querySnapshot.forEach((doc) => {
            cards.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return cards;
    } catch (error) {
        console.error("Error getting user properties: ", error);
        throw error;
    }
}

// Function to get a single card by ID
export async function getCardById(cardId) {
    try {
        const docRef = window.db.collection("properties").doc(cardId);
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } else {
            throw new Error("Property not found");
        }
    } catch (error) {
        console.error("Error getting property: ", error);
        throw error;
    }
}

// Function to delete a card (only by owner)
export async function deleteCard(cardId) {
    try {
        if (!window.authManager || !window.authManager.currentUser) {
            throw new Error('User must be authenticated to delete properties');
        }

        // Check if user owns this property
        const propertyDoc = await window.db.collection("properties").doc(cardId).get();
        if (!propertyDoc.exists) {
            throw new Error("Property not found");
        }

        const propertyData = propertyDoc.data();
        if (propertyData.userId !== window.authManager.currentUser.uid) {
            throw new Error("You can only delete your own properties");
        }

        await window.db.collection("properties").doc(cardId).delete();
        console.log("Property deleted successfully");
    } catch (error) {
        console.error("Error deleting property: ", error);
        throw error;
    }
}

// Function to update a card (only by owner)
export async function updateCard(cardId, cardData) {
    try {
        if (!window.authManager || !window.authManager.currentUser) {
            throw new Error('User must be authenticated to update properties');
        }

        // Check if user owns this property
        const propertyDoc = await window.db.collection("properties").doc(cardId).get();
        if (!propertyDoc.exists) {
            throw new Error("Property not found");
        }

        const propertyData = propertyDoc.data();
        if (propertyData.userId !== window.authManager.currentUser.uid) {
            throw new Error("You can only update your own properties");
        }

        const cardRef = window.db.collection("properties").doc(cardId);
        await cardRef.update({
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

    if (cards.length === 0) {
        container.innerHTML = `
            <div class="no-properties" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <h3>No properties found</h3>
                <p>Start by adding your first property listing</p>
                <a href="Upload.html" class="add-property-btn">Add Property</a>
            </div>
        `;
        return;
    }

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
    
    // Check if current user owns this property
    const isOwner = window.authManager && 
                   window.authManager.currentUser && 
                   card.userId === window.authManager.currentUser.uid;
    
    cardDiv.innerHTML = `
        <div class="card-image" style="background-image: url('${imageSource}');">
        </div>
        <div class="card-content">
            <h3 class="card-title">${card.title}</h3>
            <div class="card-price">$${card.price.toFixed(2)}</div>
            <p class="card-contact">Contact: ${card.contactNumber || 'N/A'}</p>
            <p class="card-date">${card.date}</p>
            ${card.description ? `<p class="card-description">${card.description}</p>` : ''}
            <div class="card-actions">
                <button class="view-details-btn" onclick="viewPropertyDetails('${card.id}')">View Details</button>
                ${isOwner ? `<button class="delete-card-btn" onclick="deleteCardFromUI('${card.id}')">Delete</button>` : ''}
            </div>
        </div>
    `;

    return cardDiv;
}

// Global function to delete card from UI (needs to be global for onclick)
window.deleteCardFromUI = async function(cardId) {
    try {
        await deleteCard(cardId);
        // Refresh the cards display
        const cards = await getUserProperties();
        renderCards(cards);
    } catch (error) {
        console.error("Error deleting property from UI: ", error);
        alert('Error deleting property: ' + error.message);
    }
};

// Global function to view property details (needs to be global for onclick)
window.viewPropertyDetails = function(cardId) {
    window.location.href = `property-details.html?id=${cardId}`;
};

// Function to load and display cards when dashboard loads
export async function loadDashboardCards() {
    try {
        // Check if user is authenticated
        if (!window.authManager || !window.authManager.currentUser) {
            console.log("User not authenticated, redirecting to login");
            window.location.href = 'business-login.html';
            return;
        }

        // Load user's own properties for dashboard
        const cards = await getUserProperties();
        renderCards(cards);
    } catch (error) {
        console.error("Error loading dashboard properties: ", error);
        // Show error message to user
        const container = document.querySelector('.cards-grid');
        if (container) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #dc3545;">
                    <h3>Error loading properties</h3>
                    <p>${error.message}</p>
                    <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Retry</button>
                </div>
            `;
        }
    }
}

// Function to load all properties for public view
export async function loadAllProperties() {
    try {
        const cards = await getAllCards();
        renderCards(cards);
    } catch (error) {
        console.error("Error loading all properties: ", error);
        throw error;
    }
}
