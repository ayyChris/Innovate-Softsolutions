document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("send").addEventListener("click", function (event) {
        event.preventDefault(); // Evita que el formulario se envíe por defecto

        var password = document.getElementById("password").value;
        var confirmPassword = document.getElementById("confirmPassword").value;

        // Verificar que la contraseña tenga entre 6 y 14 caracteres
        if (password.length < 6 || password.length > 14) {
            // Mostrar SweetAlert con mensaje de error si la contraseña no cumple con los requisitos
            Swal.fire("Error", "La contraseña debe tener entre 6 y 14 caracteres", "error");
            return;
        }

        // Verificar que la contraseña contenga al menos una letra mayúscula
        if (!/[A-Z]/.test(password)) {
            // Mostrar SweetAlert con mensaje de error si la contraseña no contiene al menos una letra mayúscula
            Swal.fire("Error", "La contraseña debe contener al menos una letra mayúscula", "error");
            return;
        }

        // Verificar que la contraseña contenga al menos un número
        if (!/\d/.test(password)) {
            // Mostrar SweetAlert con mensaje de error si la contraseña no contiene al menos un número
            Swal.fire("Error", "La contraseña debe contener al menos un número", "error");
            return;
        }

        // Verificar que la contraseña contenga al menos un símbolo
        if (!/[^a-zA-Z0-9]/.test(password)) {
            // Mostrar SweetAlert con mensaje de error si la contraseña no contiene al menos un símbolo
            Swal.fire("Error", "La contraseña debe contener al menos un símbolo", "error");
            return;
        }

        // Verificar que las contraseñas coincidan
        if (password !== confirmPassword) {
            // Mostrar SweetAlert con mensaje de error si las contraseñas no coinciden
            Swal.fire("Error", "Las contraseñas no coinciden", "error");
            return;
        }
        // Si todas las validaciones son exitosas, enviar el formulario
        document.getElementsByClassName("register_form")[0].submit();
    });
});
