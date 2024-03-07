document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('/getUserInfo');
        const responseData = await response.json();
        console.log("Informacion del usuario cargada correctamente: ", responseData);

        if (response.ok) {
            document.getElementById("id_user").textContent = responseData.id_user;
            document.getElementById("full_name").textContent = responseData.full_name;
            document.getElementById("email").textContent = responseData.email;
            document.getElementById("username").textContent = responseData.username;
            document.getElementById("phone").textContent = responseData.phone;
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

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('/showCard');
        const cardInfoArray = await response.json();
        console.log("main.js cardinfo", cardInfoArray);

        if (response.ok) {
            // Obtener el elemento contenedor del grid
            const cardGrid = document.getElementById("cardGrid");

            // Iterar sobre cada objeto en el array cardInfoArray
            cardInfoArray.forEach(cardInfo => {
                // Crear un nuevo elemento div para mostrar la información del carrito
                const cardItem = document.createElement('div');
                cardItem.classList.add('card-item');
                cardItem.innerHTML = `
                    <p>ID: ${cardInfo.id}</p>
                    <p>Servicio: ${cardInfo.service}</p>
                `;
                cardGrid.appendChild(cardItem);
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while retrieving card information.'
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





