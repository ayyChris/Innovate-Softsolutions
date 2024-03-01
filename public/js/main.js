document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('/getUserInfo');
        const responseData = await response.json();
        console.log("HOLA DESDE MAIN", responseData);

        if (response.ok) {
            document.getElementById("userID").textContent = responseData.UserID;
            document.getElementById("username").textContent = responseData.Username;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while retrieving user information.'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while processing the request.'
        });
    }
});



