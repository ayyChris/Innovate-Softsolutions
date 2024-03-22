const axios = require('axios');
const xml2js = require('xml2js');

// Obtener la fecha actual en el formato dd/mm/yyyy
const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0');
const year = today.getFullYear();
const fechaActual = `${day}/${month}/${year}`;

const nombre = 'Christian';
const subNiveles = 'N';
const correoElectronico = 'chrisbf11@gmail.com';
const token = 'C3OC228T6A';

// Función para obtener el valor de compra del dólar del Banco Central de Costa Rica
async function obtenerValorCompra() {
    try {
        // Parámetros para la solicitud al servicio web del Banco Central de Costa Rica
        const indicador = 318;


        // Realizar la solicitud al servicio web del Banco Central de Costa Rica
        const response = await axios.get('https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML', {
            params: {
                indicador: indicador,
                fechaInicio: fechaActual,
                fechaFinal: fechaActual,
                nombre: nombre,
                subNiveles: subNiveles,
                correoElectronico: correoElectronico,
                token: token
            }
        });

        // Parsear la respuesta XML
        const xmlData = await xml2js.parseStringPromise(response.data);

        // Extraer el valor de compra del dólar
        let valorCompraDolar;
        if (xmlData && xmlData.string && xmlData.string._) {
            const datos = xmlData.string._;
            const parser = new xml2js.Parser({ explicitArray: false });
            parser.parseString(datos, (err, result) => {
                if (err) {
                    console.error('Error al parsear la respuesta XML:', err);
                    return;
                }
                valorCompraDolar = parseFloat(result.Datos_de_INGC011_CAT_INDICADORECONOMIC.INGC011_CAT_INDICADORECONOMIC.NUM_VALOR);
            });
        } else {
            console.error('Estructura de respuesta XML inesperada:', xmlData);
            return;
        }

        // Mostrar el valor de compra del dólar en la consola
        console.log(`Valor de compra del dólar: ${valorCompraDolar} colones`);
    } catch (error) {
        console.error('Error al obtener el valor de compra del dólar:', error);
    }
}

// Función para obtener el valor de venta del dólar del Banco Central de Costa Rica
async function obtenerValorVenta() {
    try {
        // Parámetros para la solicitud al servicio web del Banco Central de Costa Rica
        const indicador = 317;


        // Realizar la solicitud al servicio web del Banco Central de Costa Rica
        const response = await axios.get('https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML', {
            params: {
                indicador: indicador,
                fechaInicio: fechaActual,
                fechaFinal: fechaActual,
                nombre: nombre,
                subNiveles: subNiveles,
                correoElectronico: correoElectronico,
                token: token
            }
        });

        // Parsear la respuesta XML
        const xmlData = await xml2js.parseStringPromise(response.data);

        // Extraer el valor de compra del dólar
        let valorVentaDolar;
        if (xmlData && xmlData.string && xmlData.string._) {
            const datos = xmlData.string._;
            const parser = new xml2js.Parser({ explicitArray: false });
            parser.parseString(datos, (err, result) => {
                if (err) {
                    console.error('Error al parsear la respuesta XML:', err);
                    return;
                }
                valorVentaDolar = parseFloat(result.Datos_de_INGC011_CAT_INDICADORECONOMIC.INGC011_CAT_INDICADORECONOMIC.NUM_VALOR);
            });
        } else {
            console.error('Estructura de respuesta XML inesperada:', xmlData);
            return;
        }

        // Mostrar el valor de venta del dólar en la consola
        console.log(`Valor de venta del dólar: ${valorVentaDolar} colones`);
    } catch (error) {
        console.error('Error al obtener el valor de compra del dólar:', error);
    }
}

obtenerValorCompra();
obtenerValorVenta();
