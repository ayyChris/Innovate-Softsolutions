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

//            console.log('pages/new.html?lat='+ lat +'&lon='+lon');
$(document).ready(function () {
    getData(
        "https://ubicaciones.paginasweb.cr/provincias.json",
        function (data) {
            arrayToOptions(data, $("#provincias"), 'Provincias');
        }
    );
});
var map;
var geocoder;
var crLat = 9.6301892;
var crLng = -84.2541843;
function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: crLat, lng: crLng },
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: { lat: crLat, lng: crLng }
    });
    google.maps.event.addListener(marker, 'dragend', function () {
        onMakerMove(marker);
    });
}
function codeAddress(address) {
    geocoder.geocode({ 'address': address }, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            onMakerMove(marker);
        } else {
            console.debug('No pudimos obtener la dirección porque: ' + status);
        }
    });
}
function onMakerMove(marker) {
    $("#coordenadas").val(marker.getPosition().toString().replace('(', '').replace(')', ''));
}
function getCantones(idProvincia) {
    map.setZoom(9);
    codeAddress("Costa Rica, " + $('#provincias option:selected').text());
    getData(
        "https://ubicaciones.paginasweb.cr/provincia/" + idProvincia + "/cantones.json",
        function (data) {
            arrayToOptions(data, $("#cantones"), 'Cantones');
            $(".canton").show();
            $(".distrito").hide();
            $(".send").hide();
        }
    );
}
function getDistritos(idCanton) {
    var query = "Costa Rica, " + $('#provincias option:selected').text() + ', ' + $('#cantones option:selected').text();
    console.log(query);
    map.setZoom(12);
    codeAddress(query);
    var idProvincia = $("#provincias").val();
    getData(
        "https://ubicaciones.paginasweb.cr/provincia/" + idProvincia + "/canton/" + idCanton + "/distritos.json",
        function (data) {
            arrayToOptions(data, $("#distritos"), 'Distritos');
            $(".distrito").show();
            $(".send").hide();
        }
    );
}
function distritoSelected() {
    var query = "Costa Rica, " + jQuery('#provincias option:selected').text() + "," + jQuery('#cantones option:selected').text() + "," + jQuery('#distritos option:selected').text();
    map.setZoom(15);
    codeAddress(query);
    calcPostal();
    $('.send').show()
}

function arrayToOptions(array, $select, title) {
    $('.list-title span').html(title);
    $select.html($('<option>').html('Seleccione una opción'));
    var $tableBody = $('.list tbody').html('');
    for (key in array) {
        $select.append($('<option>').html(array[key]).val(key));
        $tableBody.append($('<tr>').html($('<td>').html(key)).append($('<td>').html(array[key])));
    }
    calcPostal();
}
function calcPostal() {
    var format = function (value, length) {
        if (value && value.length === length) {
            return value;
        } else if (value && value.length === 1) {
            return '0' + value;
        } else {
            return length == 1 && '0' || '00';
        }
    }
    $('#postal').val(
        format($("#provincias").val(), 1) +
        format($("#cantones").val(), 2) +
        format($("#distritos").val(), 2)

    );

}
function getData(url, callback) {
    $.ajax({
        dataType: "json",
        url: url,
        success: function (data) {
            callback(data);
        },
        error: function (e) {
            console.log(e);
        }
    });
}