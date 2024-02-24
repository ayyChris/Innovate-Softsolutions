document.getElementById('buyWebApplication').addEventListener('click', function () {
    // Primera alerta para solicitar datos
    Swal.fire({
        title: 'Por favor, ingresa tus datos',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Dirección">',
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
            ];
        }
    }).then((result) => {
        // Si se ingresan datos, mostrar la siguiente alerta
        if (result.isConfirmed) {
            const [nombre, direccion] = result.value;

            Swal.fire({
                title: 'Selecciona un método de pago',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Comprar',
                cancelButtonText: 'Cancelar',
                html:
                    '<select id="payment-method" class="swal2-select">' +
                    '<option value="paypal">PayPal</option>' +
                    '<option value="tarjeta">Tarjeta de Crédito</option>' +
                    '<option value="transferencia">Transferencia Bancaria</option>' +
                    '</select>',
                focusConfirm: false,
                preConfirm: () => {
                    return document.getElementById('payment-method').value;
                }
            }).then((result) => {
                // Si se elige un método de pago y se confirma la compra, hacer la compra
                if (result.isConfirmed) {
                    const metodoPago = result.value;
                    // Solicitar información adicional según el método de pago seleccionado
                    switch (metodoPago) {
                        case 'paypal':
                            Swal.fire({
                                title: 'Introduce tu correo de PayPal',
                                input: 'email',
                                inputPlaceholder: 'Correo electrónico',
                                showCancelButton: true,
                                confirmButtonText: 'Comprar',
                                cancelButtonText: 'Cancelar',
                                preConfirm: (correo) => {
                                    return correo;
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const correoPayPal = result.value;
                                    // Aquí se podría implementar la lógica para realizar la compra con PayPal
                                    Swal.fire(
                                        'Compra realizada!',
                                        `Has comprado utilizando PayPal con el correo: ${correoPayPal}.`,
                                        'success'
                                    );
                                } else {
                                    Swal.fire(
                                        'Compra cancelada',
                                        '',
                                        'info'
                                    );
                                }
                            });
                            break;
                        case 'tarjeta':
                            Swal.fire({
                                title: 'Introduce los datos de tu tarjeta',
                                html:
                                    '<input id="swal-input3" class="swal2-input" placeholder="Número de tarjeta">' +
                                    '<input id="swal-input4" class="swal2-input" placeholder="Fecha de vencimiento (MM/AA)">' +
                                    '<input id="swal-input5" class="swal2-input" placeholder="CVC">',
                                showCancelButton: true,
                                confirmButtonText: 'Comprar',
                                cancelButtonText: 'Cancelar',
                                preConfirm: () => {
                                    return [
                                        document.getElementById('swal-input3').value,
                                        document.getElementById('swal-input4').value,
                                        document.getElementById('swal-input5').value
                                    ];
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const [numeroTarjeta, fechaVencimiento, cvc] = result.value;
                                    // Aquí se podría implementar la lógica para realizar la compra con tarjeta de crédito
                                    Swal.fire(
                                        'Compra realizada!',
                                        'Has comprado utilizando tarjeta de crédito.',
                                        'success'
                                    );
                                } else {
                                    Swal.fire(
                                        'Compra cancelada',
                                        '',
                                        'info'
                                    );
                                }
                            });
                            break;
                        case 'transferencia':
                            Swal.fire({
                                title: 'Introduce los datos para la transferencia bancaria',
                                html:
                                    '<input id="swal-input6" class="swal2-input" placeholder="Nombre del beneficiario">' +
                                    '<input id="swal-input7" class="swal2-input" placeholder="Número de cuenta">' +
                                    '<input id="swal-input8" class="swal2-input" placeholder="Cantidad a transferir">',
                                showCancelButton: true,
                                confirmButtonText: 'Comprar',
                                cancelButtonText: 'Cancelar',
                                preConfirm: () => {
                                    return [
                                        document.getElementById('swal-input6').value,
                                        document.getElementById('swal-input7').value,
                                        document.getElementById('swal-input8').value
                                    ];
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const [nombreBeneficiario, numeroCuenta, cantidad] = result.value;
                                    // Aquí se podría implementar la lógica para realizar la compra mediante transferencia bancaria
                                    Swal.fire(
                                        'Compra realizada!',
                                        'Has comprado mediante transferencia bancaria.',
                                        'success'
                                    );
                                } else {
                                    Swal.fire(
                                        'Compra cancelada',
                                        '',
                                        'info'
                                    );
                                }
                            });
                            break;
                        default:
                            Swal.fire(
                                'Error',
                                'Por favor, selecciona un método de pago válido.',
                                'error'
                            );
                    }
                }
            });
        }
    });
});

document.getElementById('buySoftware').addEventListener('click', function () {
    // Primera alerta para solicitar datos
    Swal.fire({
        title: 'Por favor, ingresa tus datos',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Dirección">',
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
            ];
        }
    }).then((result) => {
        // Si se ingresan datos, mostrar la siguiente alerta
        if (result.isConfirmed) {
            const [nombre, direccion] = result.value;

            Swal.fire({
                title: 'Selecciona un método de pago',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Comprar',
                cancelButtonText: 'Cancelar',
                html:
                    '<select id="payment-method" class="swal2-select">' +
                    '<option value="paypal">PayPal</option>' +
                    '<option value="tarjeta">Tarjeta de Crédito</option>' +
                    '<option value="transferencia">Transferencia Bancaria</option>' +
                    '</select>',
                focusConfirm: false,
                preConfirm: () => {
                    return document.getElementById('payment-method').value;
                }
            }).then((result) => {
                // Si se elige un método de pago y se confirma la compra, hacer la compra
                if (result.isConfirmed) {
                    const metodoPago = result.value;
                    // Solicitar información adicional según el método de pago seleccionado
                    switch (metodoPago) {
                        case 'paypal':
                            Swal.fire({
                                title: 'Introduce tu correo de PayPal',
                                input: 'email',
                                inputPlaceholder: 'Correo electrónico',
                                showCancelButton: true,
                                confirmButtonText: 'Comprar',
                                cancelButtonText: 'Cancelar',
                                preConfirm: (correo) => {
                                    return correo;
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const correoPayPal = result.value;
                                    // Aquí se podría implementar la lógica para realizar la compra con PayPal
                                    Swal.fire(
                                        'Compra realizada!',
                                        `Has comprado utilizando PayPal con el correo: ${correoPayPal}.`,
                                        'success'
                                    );
                                } else {
                                    Swal.fire(
                                        'Compra cancelada',
                                        '',
                                        'info'
                                    );
                                }
                            });
                            break;
                        case 'tarjeta':
                            Swal.fire({
                                title: 'Introduce los datos de tu tarjeta',
                                html:
                                    '<input id="swal-input3" class="swal2-input" placeholder="Número de tarjeta">' +
                                    '<input id="swal-input4" class="swal2-input" placeholder="Fecha de vencimiento (MM/AA)">' +
                                    '<input id="swal-input5" class="swal2-input" placeholder="CVC">',
                                showCancelButton: true,
                                confirmButtonText: 'Comprar',
                                cancelButtonText: 'Cancelar',
                                preConfirm: () => {
                                    return [
                                        document.getElementById('swal-input3').value,
                                        document.getElementById('swal-input4').value,
                                        document.getElementById('swal-input5').value
                                    ];
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const [numeroTarjeta, fechaVencimiento, cvc] = result.value;
                                    // Aquí se podría implementar la lógica para realizar la compra con tarjeta de crédito
                                    Swal.fire(
                                        'Compra realizada!',
                                        'Has comprado utilizando tarjeta de crédito.',
                                        'success'
                                    );
                                } else {
                                    Swal.fire(
                                        'Compra cancelada',
                                        '',
                                        'info'
                                    );
                                }
                            });
                            break;
                        case 'transferencia':
                            Swal.fire({
                                title: 'Introduce los datos para la transferencia bancaria',
                                html:
                                    '<input id="swal-input6" class="swal2-input" placeholder="Nombre del beneficiario">' +
                                    '<input id="swal-input7" class="swal2-input" placeholder="Número de cuenta">' +
                                    '<input id="swal-input8" class="swal2-input" placeholder="Cantidad a transferir">',
                                showCancelButton: true,
                                confirmButtonText: 'Comprar',
                                cancelButtonText: 'Cancelar',
                                preConfirm: () => {
                                    return [
                                        document.getElementById('swal-input6').value,
                                        document.getElementById('swal-input7').value,
                                        document.getElementById('swal-input8').value
                                    ];
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const [nombreBeneficiario, numeroCuenta, cantidad] = result.value;
                                    // Aquí se podría implementar la lógica para realizar la compra mediante transferencia bancaria
                                    Swal.fire(
                                        'Compra realizada!',
                                        'Has comprado mediante transferencia bancaria.',
                                        'success'
                                    );
                                } else {
                                    Swal.fire(
                                        'Compra cancelada',
                                        '',
                                        'info'
                                    );
                                }
                            });
                            break;
                        default:
                            Swal.fire(
                                'Error',
                                'Por favor, selecciona un método de pago válido.',
                                'error'
                            );
                    }
                }
            });
        }
    });
});

document.getElementById('buyMobileAplication').addEventListener('click', function () {
    // Primera alerta para solicitar datos
    Swal.fire({
        title: 'Por favor, ingresa tus datos',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Dirección">',
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
            ];
        }
    }).then((result) => {
        // Si se ingresan datos, mostrar la siguiente alerta
        if (result.isConfirmed) {
            const [nombre, direccion] = result.value;

            Swal.fire({
                title: 'Selecciona un método de pago',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Comprar',
                cancelButtonText: 'Cancelar',
                html:
                    '<select id="payment-method" class="swal2-select">' +
                    '<option value="paypal">PayPal</option>' +
                    '<option value="tarjeta">Tarjeta de Crédito</option>' +
                    '<option value="transferencia">Transferencia Bancaria</option>' +
                    '</select>',
                focusConfirm: false,
                preConfirm: () => {
                    return document.getElementById('payment-method').value;
                }
            }).then((result) => {
                // Si se elige un método de pago y se confirma la compra, hacer la compra
                if (result.isConfirmed) {
                    const metodoPago = result.value;
                    // Solicitar información adicional según el método de pago seleccionado
                    switch (metodoPago) {
                        case 'paypal':
                            Swal.fire({
                                title: 'Introduce tu correo de PayPal',
                                input: 'email',
                                inputPlaceholder: 'Correo electrónico',
                                showCancelButton: true,
                                confirmButtonText: 'Comprar',
                                cancelButtonText: 'Cancelar',
                                preConfirm: (correo) => {
                                    return correo;
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const correoPayPal = result.value;
                                    // Aquí se podría implementar la lógica para realizar la compra con PayPal
                                    Swal.fire(
                                        'Compra realizada!',
                                        `Has comprado utilizando PayPal con el correo: ${correoPayPal}.`,
                                        'success'
                                    );
                                } else {
                                    Swal.fire(
                                        'Compra cancelada',
                                        '',
                                        'info'
                                    );
                                }
                            });
                            break;
                        case 'tarjeta':
                            Swal.fire({
                                title: 'Introduce los datos de tu tarjeta',
                                html:
                                    '<input id="swal-input3" class="swal2-input" placeholder="Número de tarjeta">' +
                                    '<input id="swal-input4" class="swal2-input" placeholder="Fecha de vencimiento (MM/AA)">' +
                                    '<input id="swal-input5" class="swal2-input" placeholder="CVC">',
                                showCancelButton: true,
                                confirmButtonText: 'Comprar',
                                cancelButtonText: 'Cancelar',
                                preConfirm: () => {
                                    return [
                                        document.getElementById('swal-input3').value,
                                        document.getElementById('swal-input4').value,
                                        document.getElementById('swal-input5').value
                                    ];
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const [numeroTarjeta, fechaVencimiento, cvc] = result.value;
                                    // Aquí se podría implementar la lógica para realizar la compra con tarjeta de crédito
                                    Swal.fire(
                                        'Compra realizada!',
                                        'Has comprado utilizando tarjeta de crédito.',
                                        'success'
                                    );
                                } else {
                                    Swal.fire(
                                        'Compra cancelada',
                                        '',
                                        'info'
                                    );
                                }
                            });
                            break;
                        case 'transferencia':
                            Swal.fire({
                                title: 'Introduce los datos para la transferencia bancaria',
                                html:
                                    '<input id="swal-input6" class="swal2-input" placeholder="Nombre del beneficiario">' +
                                    '<input id="swal-input7" class="swal2-input" placeholder="Número de cuenta">' +
                                    '<input id="swal-input8" class="swal2-input" placeholder="Cantidad a transferir">',
                                showCancelButton: true,
                                confirmButtonText: 'Comprar',
                                cancelButtonText: 'Cancelar',
                                preConfirm: () => {
                                    return [
                                        document.getElementById('swal-input6').value,
                                        document.getElementById('swal-input7').value,
                                        document.getElementById('swal-input8').value
                                    ];
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const [nombreBeneficiario, numeroCuenta, cantidad] = result.value;
                                    // Aquí se podría implementar la lógica para realizar la compra mediante transferencia bancaria
                                    Swal.fire(
                                        'Compra realizada!',
                                        'Has comprado mediante transferencia bancaria.',
                                        'success'
                                    );
                                } else {
                                    Swal.fire(
                                        'Compra cancelada',
                                        '',
                                        'info'
                                    );
                                }
                            });
                            break;
                        default:
                            Swal.fire(
                                'Error',
                                'Por favor, selecciona un método de pago válido.',
                                'error'
                            );
                    }
                }
            });
        }
    });
});