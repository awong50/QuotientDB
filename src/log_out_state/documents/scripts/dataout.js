function displayResults() {
    const storedResults = JSON.parse(localStorage.getItem('formResults')) || [];
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

    const timestamp = new Date().toLocaleString(); 
    const result = { name, resource, description, timestamp };
    const results = JSON.parse(localStorage.getItem('formResults')) || [];
    results.push(result);
    localStorage.setItem('formResults', JSON.stringify(results));

    createResultBox(name, resource, description, timestamp);  

    messageDiv.textContent = 'Suggested resource submitted successfully';
    messageDiv.style.color = 'green';

    document.getElementById('suggestion').reset();
}

document.getElementById('suggestion').addEventListener('submit', handleFormSubmit);
window.addEventListener('load', displayResults);