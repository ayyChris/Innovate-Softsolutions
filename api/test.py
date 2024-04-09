import pyodbc

# Configura la conexión a la base de datos SQL Server
db_config = {
    "Driver": "{ODBC Driver 17 for SQL Server}",
    "Server": "localhost",
    "Database": "InnovateSoft Solutions",
    "UID": "sa",
    "PWD": "password1234567",
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
        if saldo_disponible < monto_total:
            # Si no hay suficientes fondos, devolver un mensaje de error
            return False, "Saldo insuficiente"

        # Si la tarjeta existe y tiene suficientes fondos, devolver True y un mensaje de éxito
        return True, "Tarjeta verificada y fondos suficientes"

    except Exception as e:
        print("Error al verificar tarjeta y fondos:", e)
        return False, "Error al verificar tarjeta y fondos"


verificado, mensaje = verificar_tarjeta_y_fondos(1234567812345678, 1000)
print(verificado, mensaje)
