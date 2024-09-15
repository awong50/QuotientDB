function createWorkspaceBox(title, description, tags, workspaceId) {
    const workspaceBox = document.createElement('div');
    workspaceBox.classList.add('workspace-box');

    const workspaceTitle = document.createElement('h3');
    workspaceTitle.textContent = title;
    workspaceBox.appendChild(workspaceTitle);

    const workspaceDescription = document.createElement('p');
    workspaceDescription.textContent = description;
    workspaceBox.appendChild(workspaceDescription);

    const tagsContainer = document.createElement('div');
    tagsContainer.classList.add('tags');

    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.classList.add('tag');
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });

    workspaceBox.appendChild(tagsContainer);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-workspace-btn');
    workspaceBox.appendChild(deleteButton);

    workspaceBox.dataset.workspaceId = workspaceId;

    return workspaceBox;
}


document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem("username");
    document.getElementById('user-details-name').textContent = username;

    const createWorkspaceBtn = document.getElementById('create-workspace-btn');
    const workspaceModal = document.getElementById('workspace-modal');
    const closeModal = document.querySelector('.modal .close');
    const workspaceForm = document.getElementById('workspace-form');
    const workspacesContainer = document.getElementById('workspaces');
    const workspaceDropdown = document.getElementById('workspace-dropdown');
    const sidebarToggleBtn = document.querySelector("#btn");
    let dropdownHeight = 0;

    function loadProjects() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const userProjectsKey = `projects_${currentUser.username}`;
        const savedProjects = JSON.parse(localStorage.getItem(userProjectsKey)) || [];

        savedProjects.forEach(project => {
            createWorkspaceElement(project.name, project.description, project.tags, project.workspaceId);
        });

        updateDropdownHeight();
    }

    function saveProjects() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const userProjectsKey = `projects_${currentUser.username}`;
        const projects = Array.from(workspacesContainer.children).map(workspace => {
            const name = workspace.querySelector('h3').textContent;
            const description = workspace.querySelector('p').textContent;
            const tags = Array.from(workspace.querySelectorAll('.tag')).map(tag => tag.textContent);
            const workspaceId = workspace.dataset.workspaceId;
            return { name, description, tags, workspaceId };
        });
        localStorage.setItem(userProjectsKey, JSON.stringify(projects));
        console.log('Projects saved:', projects);
    }

    function createWorkspaceElement(name, description, tags, workspaceId) {
        if (!workspaceId) {
            workspaceId = `workspace_${Date.now()}`;
        }

        const workspace = createWorkspaceBox(name, description, tags, workspaceId);

        workspacesContainer.appendChild(workspace);

        const sidebarWorkspaceItem = document.createElement('li');
        sidebarWorkspaceItem.dataset.name = name;
        sidebarWorkspaceItem.dataset.workspaceId = workspaceId; 
        sidebarWorkspaceItem.innerText = name;
        workspaceDropdown.appendChild(sidebarWorkspaceItem);

        updateDropdownHeight();

        workspace.querySelector('button').onclick = (e) => {
            e.stopPropagation();
            workspacesContainer.removeChild(workspace);
            workspaceDropdown.removeChild(sidebarWorkspaceItem);
            localStorage.removeItem(`selectedFiles_${workspaceId}`); 
            localStorage.removeItem(`todoItems_${workspaceId}`); 
            saveProjects();
            updateDropdownHeight();
        };

        workspace.onclick = () => {
            showWorkspaceView(name, description, workspaceId);
        };
    }

    createWorkspaceBtn.onclick = () => {
        workspaceModal.style.display = "block";
    };

    closeModal.onclick = () => {
        workspaceModal.style.display = "none";
    };

    workspaceForm.onsubmit = function(event) {
        event.preventDefault();

        const workspaceName = document.getElementById('workspace-name').value;
        const workspaceDesc = document.getElementById('workspace-desc').value;
        const selectedTags = Array.from(document.querySelectorAll('input[name="workspace-tags"]:checked')).map(tag => tag.value);

        createWorkspaceElement(workspaceName, workspaceDesc, selectedTags);

        saveProjects();

        workspaceForm.reset();
        workspaceModal.style.display = "none";
    };

    function createTodoItem(task) {
        const li = document.createElement('li');
        li.classList.add('todo-item');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✔️';
        deleteBtn.classList.add('delete-todo-btn');

        li.appendChild(deleteBtn);
        li.appendChild(document.createTextNode(task));

        deleteBtn.onclick = () => {
            li.remove();
        };

        return li;
    }

    const dropdownBtn = document.querySelector('.dropdown-btn');
    dropdownBtn.onclick = () => {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar.classList.contains('active') && !dropdownBtn.classList.contains('dropdown-btn-disabled')) {
            const isDropdownActive = workspaceDropdown.classList.toggle('active');
            const dropdownHeight = isDropdownActive ? workspaceDropdown.scrollHeight : 0;
            document.querySelectorAll('.nav_list > li').forEach((li, index) => {
                if (index > 0) {
                    li.style.transform = `translateY(${dropdownHeight}px)`;
                }
            });
        }
    };

    sidebarToggleBtn.onclick = function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle("active");
        updateDropdownHeight();
    };

    workspaceForm.onsubmit = function(event) {
        event.preventDefault();

        const workspaceName = document.getElementById('workspace-name').value;
        const workspaceDesc = document.getElementById('workspace-desc').value;
        const selectedTags = Array.from(document.querySelectorAll('input[name="workspace-tags"]:checked')).map(tag => tag.value);

        createWorkspaceElement(workspaceName, workspaceDesc, selectedTags);
        saveProjects(); 

        workspaceForm.reset();
        workspaceModal.style.display = "none";
    };

    function updateDropdownHeight() {
        dropdownHeight = workspaceDropdown.offsetHeight;
        document.documentElement.style.setProperty('--dropdown-height', dropdownHeight);

        const dropdownBtn = document.querySelector('.dropdown-btn');
        const sidebar = document.querySelector('.sidebar');

        if (sidebar.classList.contains('active') && workspaceDropdown.children.length > 0) {
            dropdownBtn.classList.remove('dropdown-btn-disabled', 'dropdown-btn-hidden');
            dropdownBtn.style.pointerEvents = 'auto'; 
        } else {
            dropdownBtn.classList.add('dropdown-btn-disabled', 'dropdown-btn-hidden');
            dropdownBtn.style.pointerEvents = 'none'; 
        }
    }

    sidebarToggleBtn.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('active');
    });

    function showWorkspaceView(name, description, workspaceId) {
        const workspaceView = document.getElementById('workspace-view');
        workspaceView.classList.add('active');
        workspacesContainer.style.display = 'none';
        createWorkspaceBtn.style.display = 'none';

        workspaceView.innerHTML = `
            <button id="return-btn">Return</button>
            <div class="workspace-title">
                <h1>${name}</h1>
            </div>
            <div class="workspace-details">
                <div class="saved-resources">
                    <h2>Saved Resources</h2>
                    <div class="resources-box">
                        <div class="workspace-dropdown">
                            <button class="workspace-dropbtn">Add Resource</button>
                            <div class="workspace-dropdown-content" id="fileDropdown">
                            </div>
                        </div>
                        <div id="selectedFiles">
                        </div>
                    </div>
                </div>
                <div class="todo-list">
                    <h2>Tasks</h2>
                    <div class="todo-box">
                        <input type="text" id="new-todo" placeholder="New task...">
                        <button id="add-todo">Add</button>
                        <ul id="todo-items"></ul>
                    </div>
                </div>
            </div>
        `;

        const files = ['anatomy.html', 'calculus.html', 'cell.html', 'chem.html', 'civil.html', 'compete.html', 'csec.html', 'ecology.html', 'electro.html', 'electromagnetism.html', 'high.html', 'kinematics.html', 'mech.html', 'network.html', 'nuclear.html', 'oly.html', 'planguages.html', 'softdev.html', 'structural.html', 'thermo.html'];
        const dropdownContent = document.getElementById('fileDropdown');
        const selectedFilesContainer = document.getElementById('selectedFiles');

        let selectedFiles = JSON.parse(localStorage.getItem(`selectedFiles_${workspaceId}`)) || [];

        function saveSelectedFiles() {
            localStorage.setItem(`selectedFiles_${workspaceId}`, JSON.stringify(selectedFiles));
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function displaySelectedFile(file) {
            const displayFileName = file.replace(/\.html$/, '');
        
            const selectedFile = document.createElement('div');
            selectedFile.className = 'selected-file';
            selectedFile.textContent = capitalizeFirstLetter(displayFileName); 
        
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-file';
            removeBtn.textContent = 'x';
            removeBtn.addEventListener('click', function(event) {
                event.stopPropagation();
                removeFile(file, selectedFile);
            });
        
            selectedFile.appendChild(removeBtn);
            selectedFilesContainer.appendChild(selectedFile);
        
            selectedFile.addEventListener('click', () => {
                const filePath = `documents/${file}`; 
                window.open(filePath, '_self'); 
            });
        }
        

        selectedFiles.forEach(file => {
            displaySelectedFile(file);
            const link = Array.from(dropdownContent.children).find(link => link.textContent === file);
            if (link) {
                dropdownContent.removeChild(link);
            }
        });

        files.forEach(file => {
            if (!selectedFiles.includes(file)) {
                const displayFileName = file.replace(/\.html$/, '');
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = displayFileName;
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    selectFile(file, link);
                });
                dropdownContent.appendChild(link);
            }
        });

        function selectFile(file, link) {
            dropdownContent.removeChild(link);
            selectedFiles.push(file);
            saveSelectedFiles();
            displaySelectedFile(file);
        }

        function removeFile(file, selectedFile) {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = file;
            link.addEventListener('click', function(event) {
                event.preventDefault();
                selectFile(file, link);
            });

            dropdownContent.appendChild(link);
            selectedFiles = selectedFiles.filter(f => f !== file);
            saveSelectedFiles();
            selectedFilesContainer.removeChild(selectedFile);
        }

        const todoItems = document.getElementById('todo-items');
        const newTodoInput = document.getElementById('new-todo');
        const addTodoBtn = document.getElementById('add-todo');

        let todoList = JSON.parse(localStorage.getItem(`todoItems_${workspaceId}`)) || [];

        function saveTodoItems() {
            localStorage.setItem(`todoItems_${workspaceId}`, JSON.stringify(todoList));
        }

        function renderTodoItems() {
            todoItems.innerHTML = '';
            todoList.forEach((todo, index) => {
                const li = createTodoItem(todo);
                li.querySelector('button').addEventListener('click', () => {
                    todoList.splice(index, 1);
                    saveTodoItems();
                    renderTodoItems();
                });
                todoItems.appendChild(li);
            });
        }

        addTodoBtn.onclick = () => {
            const task = newTodoInput.value.trim();
            if (task) {
                todoList.push(task);
                newTodoInput.value = '';
                saveTodoItems();
                renderTodoItems();
            }
        };

        renderTodoItems();

        document.getElementById('return-btn').onclick = function() {
            workspaceView.classList.remove('active');
            workspacesContainer.style.display = 'block';
            createWorkspaceBtn.style.display = 'block';
            workspacesContainer.style.display = 'flex';
            workspacesContainer.style.flexWrap = 'wrap';
            workspacesContainer.style.gap = '20px'; 
        };
    }

    workspaceDropdown.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            const workspaceId = e.target.dataset.workspaceId;
            const name = e.target.dataset.name;
            const description = e.target.innerText;
            showWorkspaceView(name, description, workspaceId);
        }
    });
    
    function updateDropdownHeight() {
        const dropdownItems = workspaceDropdown.children;
        const dropdownHeight = Array.from(dropdownItems).reduce((total, item) => total + item.offsetHeight, 0);
        workspaceDropdown.style.height = `${dropdownHeight}px`;
    }

    loadProjects();

});

document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem("username");
    document.getElementById('user-details-name').textContent = username;

    const sidebarToggleBtn = document.querySelector("#btn");
    const sidebar = document.querySelector('.sidebar');

    sidebarToggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        updateDropdownHeight();
        
        if (!sidebar.classList.contains('active')) {
            workspaceDropdown.classList.remove('active');
        }
    });

    function updateDropdownHeight() {
        const dropdownBtn = document.querySelector('.dropdown-btn');
        const isSidebarActive = sidebar.classList.contains('active');

        if (isSidebarActive && workspaceDropdown.children.length > 0) {
            dropdownBtn.classList.remove('dropdown-btn-disabled', 'dropdown-btn-hidden');
            dropdownBtn.style.pointerEvents = 'auto';
            const dropdownHeight = workspaceDropdown.scrollHeight;
            workspaceDropdown.style.height = `${dropdownHeight}px`;
        } else {
            dropdownBtn.classList.add('dropdown-btn-disabled', 'dropdown-btn-hidden');
            dropdownBtn.style.pointerEvents = 'none';
            workspaceDropdown.style.height = '0';
        }
    }
});

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

