// Obtén una referencia al botón de búsqueda por su ID
const searchButton = document.getElementById('search-person');

// Agrega un controlador de eventos click al botón
searchButton.addEventListener('click', async () => {
    try {
        // Obtiene el valor del campo de entrada de nombre completo
        const full_name = document.getElementById('full_name').value;

        // Realiza una solicitud POST al endpoint '/find_persons' en tu servidor
        const response = await fetch('/find_persons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ full_name: full_name }) // Envía el nombre completo como parte del cuerpo de la solicitud
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
            // Si la respuesta es exitosa, convierte la respuesta a JSON
            const data = await response.json();
            // Carga los datos de la persona encontrada en el formulario de registro
            document.getElementById('full_name').value = data.full_name;
            document.getElementById('email').value = data.email;
            document.getElementById('phone').value = data.phone;
            document.getElementById('provincias').value = data.provincias;
            document.getElementById('cantones').value = data.cantones;
            document.getElementById('distritos').value = data.distritos;

            document.getElementById('email').readOnly = true;
            document.getElementById('phone').readOnly = true;
            document.getElementById('provincias').readOnly = true;
            document.getElementById('cantones').readOnly = true;
            document.getElementById('distritos').readOnly = true;


            console.log(data);
        } else {
            // Si la respuesta no es exitosa, muestra un mensaje de error
            console.error('Error al buscar persona:', response.statusText);
        }
    } catch (error) {
        console.error('Error al buscar persona:', error);
    }
});
