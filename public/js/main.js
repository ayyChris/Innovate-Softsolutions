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
        }
    } catch (error) {
        console.error('Error:', error);
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

            // Obtener el formulario de compra
            const buyForm = document.getElementById("card");

            // Manejar el evento de clic en el botón de compra
            buyForm.addEventListener("submit", async function (event) {
                event.preventDefault(); // Prevenir el envío del formulario por defecto

                // Mostrar las opciones de pago
                const { value: paymentMethod } = await Swal.fire({
                    title: 'Seleccione su método de pago',
                    input: 'select',
                    inputOptions: {
                        'tarjeta': 'Tarjeta',
                        'paypal': 'PayPal',
                        'transferencia': 'Transferencia bancaria'
                    },
                    inputPlaceholder: 'Seleccione un método de pago',
                    showCancelButton: true,
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Debe seleccionar un método de pago';
                        }
                    }
                });

                if (paymentMethod) {
                    let paymentMethodData;
                    if (paymentMethod === 'tarjeta') {
                        paymentMethodData = await Swal.fire({
                            title: 'Información de pago con tarjeta',
                            html: `
                                <input id="cardNumber" class="swal2-input" placeholder="Número de tarjeta">
                                <input id="expiryDate" class="swal2-input" placeholder="Fecha de caducidad (MM/YY)">
                                <input id="cvv" class="swal2-input" placeholder="CVV">
                            `,
                            focusConfirm: false,
                            preConfirm: () => {
                                return [
                                    document.getElementById('cardNumber').value,
                                    document.getElementById('expiryDate').value,
                                    document.getElementById('cvv').value
                                ];
                            }
                        });
                    } else if (paymentMethod === 'paypal') {
                        paymentMethodData = await Swal.fire({
                            title: 'Información de pago con PayPal',
                            html: `
                                <input id="paypalEmail" class="swal2-input" placeholder="Correo electrónico de PayPal">
                            `,
                            focusConfirm: false,
                            preConfirm: () => {
                                return document.getElementById('paypalEmail').value;
                            }
                        });
                    } else if (paymentMethod === 'transferencia') {
                        paymentMethodData = await Swal.fire({
                            title: 'Información de pago por transferencia bancaria',
                            html: `
                                <input id="bankName" class="swal2-input" placeholder="Nombre del banco">
                                <input id="accountNumber" class="swal2-input" placeholder="Número de cuenta">
                            `,
                            focusConfirm: false,
                            preConfirm: () => {
                                return [
                                    document.getElementById('bankName').value,
                                    document.getElementById('accountNumber').value
                                ];
                            }
                        });
                    }

                    // Si se proporciona información de método de pago, enviarla al servidor
                    if (paymentMethodData) {
                        // Asignar los IDs de los servicios al campo oculto en el formulario
                        const serviceIdsInput = document.getElementById("serviceIds");
                        const serviceIds = cardInfoArray.map(cardInfo => cardInfo.id);
                        serviceIdsInput.value = serviceIds.join(',');

                        // Crear un objeto de datos de pago con el método de pago y los detalles
                        const paymentData = {
                            method: paymentMethod,
                            details: paymentMethodData.value
                        };

                        // Agregar los datos de pago al formulario
                        const paymentDataInput = document.createElement('input');
                        paymentDataInput.type = 'hidden';
                        paymentDataInput.name = 'paymentData';
                        paymentDataInput.value = JSON.stringify(paymentData);
                        buyForm.appendChild(paymentDataInput);

                        // Enviar el formulario al servidor
                        this.submit();

                        // Mostrar un mensaje de éxito con un icono de verificación verde

                    }
                }
            });
        } else {
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('/getTotalPrice');
        const responseData = await response.json();
        console.log("getTotalPrice: ", responseData);

        if (response.ok) {
            document.getElementById("totalPrice").textContent = responseData.total_price;

        } else {
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('/showServices');
        const servicesInfoArray = await response.json();
        console.log("main.js serviceinfo", servicesInfoArray);

        if (response.ok) {
            // Obtener el elemento contenedor del grid
            const serviceGrid = document.getElementById("serviceGrid");

            // Iterar sobre cada objeto en el array cardInfoArray
            servicesInfoArray.forEach(servicesInfo => {
                // Crear un nuevo elemento div para mostrar la información del carrito
                const serviceItem = document.createElement('div');
                serviceItem.classList.add('service-item');
                serviceItem.innerHTML = `
                    <p>ID: ${servicesInfo.id}</p>
                    <p>Servicio: ${servicesInfo.service}</p>
                `;
                serviceGrid.appendChild(serviceItem);
            });
        } else {
        }
    } catch (error) {
        console.error('Error:', error);
    }
});




