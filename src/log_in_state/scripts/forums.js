function savePostsToLocalStorage(posts) {
    localStorage.setItem('forumPosts', JSON.stringify(posts));
}

function getPostsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('forumPosts')) || [];
}

function initializeForum() {
    const storedPosts = getPostsFromLocalStorage();
    storedPosts.forEach(function(post) {
        createPostBox(post.subject, post.tags, post.description, post.timestamp);
    });
}

function checkFormValidity() {
    const subject = document.getElementById('subject').value;
    const description = document.getElementById('description').value;
    const tagsChecked = Array.from(document.querySelectorAll('#tags input[type="checkbox"]')).some(cb => cb.checked);
    const postButton = document.getElementById('postButton');

    if (subject && tagsChecked && description) {
        postButton.classList.add('active');
        postButton.disabled = false;
    } else {
        postButton.classList.remove('active');
        postButton.disabled = true;
    }
}


document.addEventListener('DOMContentLoaded', function() {
    initializeForum();

    document.getElementById('createPostButton').addEventListener('click', function() {
        document.getElementById('postCreationBox').classList.toggle('hidden');
    });

    document.querySelectorAll('#subject, #description').forEach(function(input) {
        input.addEventListener('input', checkFormValidity);
    });

    document.querySelectorAll('#tags input[type="checkbox"]').forEach(function(checkbox) {
        checkbox.addEventListener('change', checkFormValidity);
    });

    document.getElementById('postButton').addEventListener('click', function() {
        const subject = document.getElementById('subject').value;
        const tags = Array.from(document.querySelectorAll('#tags input[type="checkbox"]:checked')).map(cb => cb.value);
        const description = document.getElementById('description').value;
        const timestamp = new Date().toLocaleString();

        const post = { subject, tags, description, timestamp, replies: [] };
        const posts = getPostsFromLocalStorage();
        posts.push(post);
        savePostsToLocalStorage(posts);

        createPostBox(subject, tags, description, timestamp);

        document.getElementById('subject').value = '';
        document.querySelectorAll('#tags input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.getElementById('description').value = '';
        document.getElementById('postButton').classList.remove('active');
        document.getElementById('postButton').disabled = true;
        document.getElementById('postCreationBox').classList.add('hidden');
    });
});

function createPostBox(subject, tags, description, timestamp) {
    const postBox = document.createElement('div');
    postBox.classList.add('post_box');
    postBox.innerHTML = `
        <div class="post_info">
            <strong>${subject}</strong><br>
            <span>${tags}</span>
        </div>
        <div class="timestamp">${timestamp}</div>
    `;

    postBox.addEventListener('click', function() {
        const postDetails = document.getElementById('postDetails');

        if (!postDetails.classList.contains('hidden') && postDetails.dataset.subject === subject) {
            postDetails.classList.add('hidden');
            postDetails.dataset.subject = '';
        } else {
            postDetails.innerHTML = `
                <h3>${subject}</h3>
                <div class="tags">${tags.join(', ')}</div>
                <hr>
                <p>${description}</p>
                <div class="reply_section">
                    <textarea id="replyText" placeholder="Write a reply..."></textarea>
                    <button id="replyButton">Reply</button>
                </div>
                <div class="replies_container" id="repliesContainer">
                    <h4>Replies</h4>
                </div>
            `;
            postDetails.classList.remove('hidden');
            postDetails.dataset.subject = subject;

            document.getElementById('replyButton').addEventListener('click', function() {
                const replyText = document.getElementById('replyText').value;
                if (replyText.trim() !== '') {
                    const replyTimestamp = new Date().toLocaleString();
                    const reply = { text: replyText, timestamp: replyTimestamp };
                    addReplyToPost(subject, reply);
                    document.getElementById('replyText').value = '';
                    displayReplies(subject);
                }
            });

            displayReplies(subject);
        }
    });

    const postsContainer = document.getElementById('postsContainer');
    postsContainer.insertBefore(postBox, postsContainer.firstChild);
}

function addReplyToPost(subject, reply) {
    const posts = getPostsFromLocalStorage();
    const post = posts.find(p => p.subject === subject);
    if (post) {
        post.replies.push(reply);
        savePostsToLocalStorage(posts);
    }
}

function displayReplies(subject) {
    const posts = getPostsFromLocalStorage();
    const post = posts.find(p => p.subject === subject);
    const repliesContainer = document.getElementById('repliesContainer');
    repliesContainer.innerHTML = '<h4>Replies</h4>'; 

    if (post && post.replies.length > 0) {
        for (let i = post.replies.length - 1; i >= 0; i--) {
            const reply = post.replies[i];
            const replyBox = document.createElement('div');
            replyBox.classList.add('reply_box');
            replyBox.innerHTML = `
                <p>${reply.text}</p>
                <div class="timestamp">${reply.timestamp}</div>
            `;
            repliesContainer.appendChild(replyBox);
        }
    }
}

document.getElementById('filterTags').addEventListener('change', function() {
    filterPosts();
});

function filterPosts() {
    const selectedTag = document.getElementById('filterTags').value;
    const posts = document.querySelectorAll('.post_box');

    posts.forEach(function(post) {
        const postTags = post.querySelector('.post_info span').textContent.split(', ');

        if (selectedTag === '' || postTags.some(tag => tag.includes(selectedTag))) {
            post.style.display = '';
        } else {
            post.style.display = 'none';
        }
    });
}



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

