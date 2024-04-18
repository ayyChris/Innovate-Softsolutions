from flask import Flask, request, jsonify
import pyodbc
import json

app = Flask(__name__)

# Configura la conexión a la base de datos SQL Server
db_config = {
    "Driver": "{ODBC Driver 17 for SQL Server}",
    "Server": "innovatesoftsolutions.database.windows.net",
    "Database": "InnovateSoft Solutions",
    "UID": "chris",
    "PWD": "Fisic@11",  # Asegúrate de reemplazar "{your_password}" con tu contraseña real
}


def verificar_tarjeta_y_fondos(numero_tarjeta, monto_total):
    try:
        conn = pyodbc.connect(**db_config)
        cursor = conn.cursor()

        # Verificar si la tarjeta existe
        query_tarjeta = "SELECT * FROM CuentasBancarias WHERE numero_tarjeta = ?"
        cursor.execute(query_tarjeta, (numero_tarjeta,))
        tarjeta = cursor.fetchone()
        print(tarjeta)

        if tarjeta is None:
            # Si la tarjeta no existe, devolver un mensaje de error
            return False, "La tarjeta no existe"

        # Verificar si la tarjeta tiene fondos suficientes
        saldo_disponible = tarjeta[3]  # El saldo está en la cuarta columna (índice 3)
        print(saldo_disponible)
        if saldo_disponible <= monto_total:
            # Si no hay suficientes fondos, devolver un mensaje de error
            return False, "Saldo insuficiente"

        # Si la tarjeta existe y tiene suficientes fondos, devolver True y un mensaje de éxito
        return True, "Tarjeta verificada y fondos suficientes"

    except Exception as e:
        print("Error al verificar tarjeta y fondos:", e)
        return False, "Error al verificar tarjeta y fondos"


def verificar_cuenta_bancaria_y_fondos(cuenta_bancaria, monto_total):
    try:
        conn = pyodbc.connect(**db_config)
        cursor = conn.cursor()

        # Verificar si la tarjeta existe
        query_cuenta_bancaria = (
            "SELECT * FROM CuentasBancarias WHERE cuenta_bancaria = ?"
        )
        cursor.execute(query_cuenta_bancaria, (cuenta_bancaria,))
        cuenta_bancaria = cursor.fetchone()
        print(cuenta_bancaria)

        if cuenta_bancaria is None:
            # Si la tarjeta no existe, devolver un mensaje de error
            return False, "La tarjeta no existe"

        # Verificar si la tarjeta tiene fondos suficientes
        saldo_disponible = cuenta_bancaria[
            3
        ]  # El saldo está en la cuarta columna (índice 3)
        print(saldo_disponible)
        if saldo_disponible <= monto_total:
            # Si no hay suficientes fondos, devolver un mensaje de error
            return False, "Saldo insuficiente"

        # Si la tarjeta existe y tiene suficientes fondos, devolver True y un mensaje de éxito
        return True, "Cuenta bancaria verificada y fondos suficientes"

    except Exception as e:
        print("Error al verificar tarjeta y fondos:", e)
        return False, "Error al verificar tarjeta y fondos"


# Función para registrar un usuario en la base de datos SQL Server
def register_user(
    username, password, full_name, email, phone, security_question, security_answer
):
    try:
        conn = pyodbc.connect(**db_config)
        cursor = conn.cursor()

        # Ejecutar la consulta para insertar el usuario
        query = "INSERT INTO Users (username, password, full_name, email, phone, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?, ?)"
        cursor.execute(
            query,
            (
                username,
                password,
                full_name,
                email,
                phone,
                security_question,
                security_answer,
            ),
        )

        conn.commit()

        # Cerrar la conexión
        cursor.close()
        conn.close()

        return True
    except Exception as e:
        print("Error al registrar usuario:", e)
        return False


@app.route("/", methods=["GET"])
def index():
    return "¡Bienvenido a mi aplicación Flask!"


@app.route("/register", methods=["POST"])
def register_user_route():
    try:
        data = request.json
        username = data["username"]
        password = data["password"]
        full_name = data["full_name"]
        email = data["email"]
        phone = data["phone"]
        security_question = data["security_question"]
        security_answer = data["security_answer"]

        # Intenta registrar al usuario en la base de datos SQL Server
        if register_user(
            username,
            password,
            full_name,
            email,
            phone,
            security_question,
            security_answer,
        ):
            return jsonify({"message": "Registro exitoso"}), 200
        else:
            return jsonify({"error": "Error al registrar usuario"}), 500
    except Exception as e:
        print("Error en la solicitud:", e)
        return jsonify({"error": "Error en la solicitud"}), 400


@app.route("/find_persons", methods=["GET"])
def find_persons():
    try:
        full_name = request.args.get("full_name")

        if full_name is None:
            return jsonify({"error": "No se proporcionó un nombre completo"}), 400

        conn = pyodbc.connect(**db_config)
        cursor = conn.cursor()

        # Ejecutar la consulta para buscar personas por nombre exacto
        query = "SELECT * FROM Persons WHERE full_name = ?"
        cursor.execute(query, (full_name))
        personas = cursor.fetchall()

        # Formatear los resultados y devolverlos en formato JSON
        # resultados = []
        for persona in personas:
            persona_info = {
                "id_person": persona[0],
                "full_name": persona[1],
                "email": persona[2],
                "phone": persona[3],
                "provincias": persona[4],
                "cantones": persona[5],
                "distritos": persona[6],
            }
            # resultados.append(persona_info)

        return jsonify(persona_info), 200
    except Exception as e:
        print("Error al buscar personas:", e)
        return jsonify({"error": "Error al buscar personas"}), 500


@app.route("/verificar_tarjeta_fondos", methods=["POST"])
def verificar_tarjeta_fondos():
    try:
        data = request.json
        print("Data recibida: ", data)

        # Si paymentData es una cadena JSON
        if isinstance(data["paymentData"], str):
            payment_data = json.loads(data["paymentData"])
            numero_tarjeta = payment_data["details"][0]
            print("Numero de tarjeta: ", numero_tarjeta)
            print("Tipo de numero de tarjeta: ", type(numero_tarjeta))
            monto_total = obtener_monto_total(data["username"])
            print("Monto total: ", monto_total)

            verificado, mensaje = verificar_tarjeta_y_fondos(
                numero_tarjeta, monto_total
            )
            if not verificado:
                return (
                    jsonify({"verificado": verificado, "mensaje": mensaje}),
                    400,
                )

        # Si paymentData es una lista de cadenas JSON
        elif isinstance(data["paymentData"], list):
            for payment_data_str in data["paymentData"]:
                payment_data = json.loads(payment_data_str)
                numero_tarjeta = payment_data["details"][0]
                print("Numero de tarjeta: ", numero_tarjeta)

                monto_total = obtener_monto_total(data["username"])
                print("Monto total: ", monto_total)

                verificado, mensaje = verificar_tarjeta_y_fondos(
                    numero_tarjeta, monto_total
                )
                if not verificado:
                    return (
                        jsonify({"verificado": verificado, "mensaje": mensaje}),
                        400,
                    )

        # Si el formato de paymentData no es reconocido
        else:
            return (
                jsonify(
                    {"verificado": False, "mensaje": "Formato de paymentData no válido"}
                ),
                400,
            )

        return (
            jsonify(
                {
                    "verificado": True,
                    "mensaje": "Tarjetas verificadas y fondos suficientes",
                }
            ),
            200,
        )

    except Exception as e:
        print("Error al verificar tarjeta y fondos:", e)
        return (
            jsonify(
                {"verificado": False, "mensaje": "Error al verificar tarjeta y fondos"}
            ),
            500,
        )


def obtener_monto_total(username):
    try:
        conn = pyodbc.connect(**db_config)
        cursor = conn.cursor()

        # Consultar el monto total de los servicios del usuario
        query = "SELECT SUM(price) FROM Services WHERE username = ? and purchase_status = 'pending'"
        cursor.execute(query, (username,))
        monto_total = cursor.fetchone()[0]  # Obtener el primer valor del resultado

        # Si el monto_total es None (no hay servicios para el usuario), establecerlo en 0
        if monto_total is None:
            monto_total = 0

        return monto_total
    except Exception as e:
        print("Error al obtener monto total:", e)
        return 0


if __name__ == "__main__":
    app.run(debug=True)
