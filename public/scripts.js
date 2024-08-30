async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/ideas', {
            method: 'GET',
            headers: {
                'username': username,
                'password': password
            }
        });

        if (response.ok) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            loadIdeas();
        } else {
            document.getElementById('login-message').innerText = 'Invalid username or password.';
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

async function addIdea() {
    const name = document.getElementById('idea-name').value;
    const description = document.getElementById('idea-description').value;
    const revenue = document.getElementById('expected-revenue').value;
    const investment = document.getElementById('investment').value;

    if (name && description && revenue && investment) {
        try {
            const response = await fetch('/ideas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'username': document.getElementById('username').value,
                    'password': document.getElementById('password').value
                },
                body: JSON.stringify({ name, description, revenue, investment })
            });

            if (response.ok) {
                loadIdeas(); // Reload ideas after adding a new one
            } else {
                alert('Error adding idea');
            }
        } catch (error) {
            console.error('Error adding idea:', error);
        }
    } else {
        alert('Please fill in all fields.');
    }
}

async function loadIdeas() {
    try {
        const response = await fetch('/ideas');
        const ideas = await response.json();
        const list = document.getElementById('ideas-list');
        list.innerHTML = '';

        ideas.forEach(idea => {
            const listItem = document.createElement('li');

            // Create and append individual elements for each idea detail
            const nameElement = document.createElement('div');
            nameElement.innerHTML = `<strong>Name:</strong> ${idea.name}`;

            const descriptionElement = document.createElement('div');
            descriptionElement.innerHTML = `<strong>Description:</strong> ${idea.description}`;

            const revenueElement = document.createElement('div');
            revenueElement.innerHTML = `<strong>Revenue:</strong> ${idea.revenue}`;

            const investmentElement = document.createElement('div');
            investmentElement.innerHTML = `<strong>Investment:</strong> ${idea.investment}`;

            // Append the elements to the list item
            listItem.appendChild(nameElement);
            listItem.appendChild(descriptionElement);
            listItem.appendChild(revenueElement);
            listItem.appendChild(investmentElement);

            // Append the list item to the list
            list.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading ideas:', error);
    }
}



async function deleteIdea(id) {
    try {
        const response = await fetch(`/ideas/${id}`, {
            method: 'DELETE',
            headers: {
                'username': document.getElementById('username').value,
                'password': document.getElementById('password').value
            }
        });

        if (response.ok) {
            loadIdeas(); // Reload ideas after deleting
        } else {
            alert('Error deleting idea');
        }
    } catch (error) {
        console.error('Error deleting idea:', error);
    }
}
