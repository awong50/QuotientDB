const sidebarToggleBtn = document.querySelector("#btn");
sidebarToggleBtn.onclick = function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle("active");
};

window.onload = function() {
    const username = localStorage.getItem("username");
    console.log(username);
    document.getElementById('user-details-name').textContent = username;
};

var pop = document.getElementById("pop");
var btn = document.getElementById("openPopUpBtn");
btn.style.padding = "5px";
btn.style.margin = "10px 0px"
var span = document.getElementsByClassName("close-btn")[0];
btn.onclick = function() {
    pop.style.display = "flex";
}
span.onclick = function() {
    pop.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == pop) {
        pop.style.display = "none";
    }
}
const pageIdentifier = window.location.pathname;
const uniqueKey = `formResults_${pageIdentifier}`;

function displayResults() {
    const storedResults = JSON.parse(localStorage.getItem(uniqueKey)) || [];
    storedResults.forEach(function(result) {
        createResultBox(result.name, result.resource, result.description, result.timestamp);
    });
}

function createResultBox(name, resource, description, timestamp) {
    const result = document.createElement('div');
    result.classList.add('result_box');
    result.innerHTML = `
        <h2>${name}</h2>
        <p><a href="${resource}" target="_blank">${resource}</a></p>
        <p>${description}</p>
        <small style="text-align: right; display: block; color: #555;">${timestamp}</small>`;
    document.getElementById('results').appendChild(result);
}

function handleFormSubmit(event) {
    event.preventDefault();

    const messageDiv = document.getElementById('message');
    const name = document.getElementById('name').value;
    const resource = document.getElementById('resource').value;
    const description = document.getElementById('description').value;

    if (!resource.includes('http://') && !resource.includes('https://')) {
        messageDiv.textContent = 'Please submit a valid URL';
        messageDiv.style.color = 'red';
        return;
    }

    const timestamp = new Date().toLocaleString();  // Get the current date and time
    const result = { name, resource, description, timestamp };
    const results = JSON.parse(localStorage.getItem('formResults')) || [];
    results.push(result);
    localStorage.setItem(uniqueKey, JSON.stringify(results));

    createResultBox(name, resource, description, timestamp);  // Display the new result immediately

    messageDiv.textContent = 'Suggested resource submitted successfully';
    messageDiv.style.color = 'green';

    // Clear the form
    document.getElementById('suggestion').reset();
}

document.getElementById('suggestion').addEventListener('submit', handleFormSubmit);
window.addEventListener('load', displayResults);



const userDetailsName = document.getElementById('user-details-name');
const userProfileImage = document.querySelector('.user_details img'); // Select profile picture in sidebar

// Pre-fill the form with values from local storage on page load
window.addEventListener('load', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        const profilePictureKey = `profile_picture_${currentUser.username}`;
        const savedProfilePicture = localStorage.getItem(profilePictureKey);
        if (savedProfilePicture) {
            userProfileImage.src = savedProfilePicture;
        } else {
            userProfileImage.src = defaultProfilePicture; // Use default picture if none is saved
        }
        // The password fields should be left empty for security reasons
    }
});


// Function to update username display
function updateUsernameDisplay(username) {
    userDetailsName.textContent = username;
}

// Username display logic on page load
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (currentUser && currentUser.username) {
        updateUsernameDisplay(currentUser.username); // Update the username display when the page loads
    }
};
