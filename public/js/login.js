// Obtener el nombre de usuario de las cookies
const username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];

// Asignar el nombre de usuario al elemento span
document.getElementById('userVerify').textContent = username;
