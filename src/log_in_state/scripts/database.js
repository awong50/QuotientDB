document.querySelectorAll('.dropbtn').forEach(button => {
  button.addEventListener('click', function () {
      const dropdownContent = this.nextElementSibling;
      dropdownContent.classList.toggle('show');

      if (dropdownContent.classList.contains('show')) {
          dropdownContent.style.display = 'block';
      } else {
          dropdownContent.style.display = 'none';
      }

      adjustMainContainerHeight();
  });
});

function adjustMainContainerHeight() {
  const mainContainer = document.querySelector('.main__container');
  const contentHeight = Array.from(document.querySelectorAll('.dropdown-content'))
      .reduce((total, dropdown) => total + (dropdown.classList.contains('show') ? dropdown.scrollHeight : 0), 0);
  mainContainer.style.minHeight = `${contentHeight + 200}px`; 
}

let btn = document.querySelector("#btn");
let sidebar = document.querySelector(".sidebar");

btn.onclick = function () {
  sidebar.classList.toggle("active");
  document.querySelector('.main__container').style.marginLeft = sidebar.classList.contains("active") ? "240px" : "78px";
};

const userDetailsName = document.getElementById('user-details-name');
const userProfileImage = document.querySelector('.user_details img'); 

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


function updateUsernameDisplay(username) {
    userDetailsName.textContent = username;
}

window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (currentUser && currentUser.username) {
        updateUsernameDisplay(currentUser.username); 
    }
};

