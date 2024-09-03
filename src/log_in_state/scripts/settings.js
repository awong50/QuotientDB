const profileForm = document.getElementById('profile-form');
const usernameForm = document.getElementById('username-form');
const passwordForm = document.getElementById('password-form');

const currentPasswordInput = document.getElementById('current_password');
const newPasswordInput = document.getElementById('new_password');
const confirmPasswordInput = document.getElementById('confirm_password');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const saveButton = document.getElementById('saveButton');

const successNotification = document.getElementById('success-notification');
const userDetailsName = document.getElementById('user-details-name');
const userProfileImage = document.querySelector('.user_details img'); 

const defaultProfilePicture = 'images/default_profile_picture.png'; 

function showSuccessMessage(message) {
    successNotification.textContent = message;
    successNotification.style.display = 'block';

    setTimeout(function() {
        successNotification.style.display = 'none';
    }, 3000);
}

function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function(message) {
        message.remove();
    });
}

function displayErrorMessage(inputElement, message) {
    const errorMessage = document.createElement('small');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    inputElement.parentNode.appendChild(errorMessage);
}

function clearFormFields() {
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
    usernameInput.value = '';
    profileForm.querySelector('input').value = '';
}

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, value); 
}

function saveToLocalStorageString(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function updateUsernameDisplay(username) {
    userDetailsName.textContent = username;
}

function renameProfilePictureKey(oldUsername, newUsername) {
    const oldKey = `profile_picture_${oldUsername}`;
    const newKey = `profile_picture_${newUsername}`;
    const profilePictureData = localStorage.getItem(oldKey);
    
    if (profilePictureData) {
        localStorage.setItem(newKey, profilePictureData); 
        localStorage.removeItem(oldKey); 
    }
}

function validateEmailFormat(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

saveButton.addEventListener('click', function(event) {
    event.preventDefault(); 
    
    clearErrorMessages();
    let message = '';
    let dataSaved = false;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (emailInput.value && !validateEmailFormat(emailInput.value)) {
        displayErrorMessage(emailInput, 'Please enter a valid email address.');
        return;
    }

    if (emailInput.value && emailInput.value !== currentUser.email) {
        const emailExists = users.some(user => user.email === emailInput.value);
        if (emailExists) {
            displayErrorMessage(emailInput, 'This email is already in use.');
            return;
        }

        currentUser.email = emailInput.value;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        users = users.map(user => 
            user.username === currentUser.username ? { ...user, email: emailInput.value } : user
        );
        localStorage.setItem('users', JSON.stringify(users));

        message += 'Email has been successfully updated. ';
        dataSaved = true;
    }


    const profilePictureInput = profileForm.querySelector('input');
    const profilePictureKey = `profile_picture_${currentUser.username}`;
    if (profilePictureInput.files.length > 0) {
        const file = profilePictureInput.files[0];
        const validFileTypes = ['image/jpeg', 'image/png'];
        if (validFileTypes.includes(file.type)) {
            const reader = new FileReader();
            reader.onload = function(e) {
                saveToLocalStorage(profilePictureKey, e.target.result);
                userProfileImage.src = e.target.result; 
            };
            reader.readAsDataURL(file);
            message += 'Profile picture has been successfully updated. ';
            dataSaved = true;
        } else {
            displayErrorMessage(profilePictureInput, 'Please upload a valid JPG or PNG file.');
            return;
        }
    }

    if (usernameInput.value && usernameInput.value !== currentUser.username) {
        renameProfilePictureKey(currentUser.username, usernameInput.value);

        currentUser.username = usernameInput.value;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        users = users.map(user => 
            user.email === currentUser.email ? { ...user, username: usernameInput.value } : user
        );
        localStorage.setItem('users', JSON.stringify(users));
        
        updateUsernameDisplay(usernameInput.value); 
        message += 'Username has been successfully updated. ';
        dataSaved = true;
    }

    if (newPasswordInput.value && currentPasswordInput.value) {
        if (currentPasswordInput.value === currentUser.password) {
            if (newPasswordInput.value === confirmPasswordInput.value) {
                currentUser.password = newPasswordInput.value;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                users = users.map(user => 
                    user.email === currentUser.email ? { ...user, password: newPasswordInput.value } : user
                );
                localStorage.setItem('users', JSON.stringify(users));

                message += 'Password has been successfully updated. ';
                dataSaved = true;
            } else {
                displayErrorMessage(confirmPasswordInput, 'Passwords do not match');
                return; 
            }
        } else {
            displayErrorMessage(currentPasswordInput, 'Current password is incorrect');
            return; 
        }
    } else if (newPasswordInput.value || currentPasswordInput.value) {
        displayErrorMessage(currentPasswordInput, 'Please fill in all password fields');
        return;
    }

    if (dataSaved) {
        showSuccessMessage(message.trim());
        clearFormFields();
    }
});

window.addEventListener('load', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        const profilePictureKey = `profile_picture_${currentUser.username}`;
        const savedProfilePicture = localStorage.getItem(profilePictureKey);
        if (savedProfilePicture) {
            userProfileImage.src = savedProfilePicture;
        } else {
            userProfileImage.src = defaultProfilePicture;
        }
    }
});

let btn = document.querySelector("#btn");
let sidebar = document.querySelector(".sidebar");

btn.onclick = function(){
    sidebar.classList.toggle("active");
};


window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (currentUser && currentUser.username) {
        updateUsernameDisplay(currentUser.username); 
    }
};
