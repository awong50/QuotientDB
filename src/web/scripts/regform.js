const signInBtnLink = document.querySelector('.signInBtn-link');
const signUpBtnLink = document.querySelector('.signUpBtn-link');
const wrapper = document.querySelector('.wrapper');
const errorBar = document.getElementById("error-bar");

signUpBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});
signInBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});

function validateLogin() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const errorMessage = document.getElementById("login-error-message");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        // Save the updated user details to localStorage as session identifiers
        localStorage.setItem("currentUser", JSON.stringify({
            username: user.username,
            email: user.email,
            password: user.password
        }));

        errorMessage.textContent = ""; 
        window.location.href = "log_in_state/workspace.html";
        return true;
    } else {
        errorMessage.textContent = "Invalid username or password!";
        return false;
    }
}


function handleSignUp(event) {
    event.preventDefault(); 

    const usernameInput = document.querySelector('.sign-up input[type="text"]').value.trim();
    const emailInput = document.querySelector('.sign-up input[type="email"]').value.trim();
    const passwordInput = document.getElementById("signup-password").value.trim();
    const termsCheckbox = document.getElementById("terms-checkbox");
    const termsErrorMessage = document.getElementById("terms-error-message");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!termsCheckbox.checked) {
        passwordInput.value = ""; 
        termsErrorMessage.textContent = "You must accept the terms and conditions"; 
        setTimeout(() => {
            termsErrorMessage.textContent = "";
        }, 1000); 
        return; 
    }

    if (usernameInput === "" || emailInput === "" || passwordInput === "") {
        termsErrorMessage.textContent = "Username, email, and password cannot be empty!";
        setTimeout(() => {
            termsErrorMessage.textContent = "";
        }, 1000); 
        return;
    }

    if (!emailPattern.test(emailInput)) {
        termsErrorMessage.textContent = "Invalid email!";
        setTimeout(() => {
            termsErrorMessage.textContent = "";
        }, 1000); 
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.some(user => user.username === usernameInput || user.email === emailInput);

    if (existingUser) {
        errorBar.style.display = "block";
        errorBar.style.backgroundColor = "red";
        errorBar.textContent = "Username and/or email already exists!";
        setTimeout(() => {
            errorBar.style.display = "none";
        }, 1000); 
    } else {
        users.push({ username: usernameInput, email: emailInput, password: passwordInput });
        localStorage.setItem("users", JSON.stringify(users));

        errorBar.style.display = "block";
        errorBar.style.backgroundColor = "green";
        errorBar.textContent = "Sign Up Successful! You can now log in.";

        setTimeout(() => {
            wrapper.classList.remove('active');
            errorBar.style.display = "none"; 
        }, 1000); 
    }
}

document.querySelector('.sign-in form').addEventListener('submit', (event) => {
    event.preventDefault();
    validateLogin();
});
