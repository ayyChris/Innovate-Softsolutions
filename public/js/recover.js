document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('/getSecurityQuestion');
        const responseData = await response.json();
        console.log("Pregunta de seguridad cargada: ", responseData);

        if (response.ok) {
            document.getElementById("security_question").textContent = responseData.security_question;

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