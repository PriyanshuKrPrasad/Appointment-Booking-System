document.getElementById('registrationForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Capture registration form data
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;

    // Make sure fields are not empty
    if (!username || !email) {
        document.getElementById('message').innerText = 'Please fill out all fields.';
        return;
    }

    
    // Create data object to send to server
    const data = {
        username: username,
        email: email
    };


    try {
        // Send POST request to server for registration
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email }),
        });

        const result = await response.json();

        if (response.ok) {
            // Display success message and show appointment form
            document.getElementById('message').innerText = `Registered successfully! User ID: ${result.user_id}`;
            document.getElementById('appointmentSection').style.display = 'block';
            document.getElementById('user_id').value = result.user_id; // Auto-fill the user ID
        } else {
            // Display error message
            document.getElementById('message').innerText = `Error registering user: ${result.error}`;
        }
    } catch (error) {
        document.getElementById('message').innerText = 'Error registering user. Please try again later.';
    }
});

document.getElementById('appointmentForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Capture appointment form data
    const user_id = document.getElementById('user_id').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    // Create data object to send to server
    const data = {
        user_id: user_id,
        date: date,
        description: description
    };

    try {
        // Send POST request to server for booking appointment
        const response = await fetch('http://localhost:5000/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            // Display success message
            document.getElementById('message').innerText = `Appointment booked! ID: ${result.id}`;
        } else {
            // Display error message
            document.getElementById('message').innerText = `Error booking appointment: ${result.error}`;
        }
    } catch (error) {
        document.getElementById('message').innerText = 'Error booking appointment. Please try again later.';
    }
});
