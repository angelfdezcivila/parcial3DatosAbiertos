//const Gas = require("../models/Gas.model");
const Gas = require("../data/gas.json");

// Retrieve all gas
exports.findAll = (req, res) => {

    res.json(Gas);
    
}

exports.findByLocalidad = (req, res) => {

    const localidad = req.params.localidad.toUpperCase();
    const gas = Gas.ListaEESSPrecio.filter( g => g.Localidad == localidad).map( g => {
        return {
            "Dirección": g.Dirección,
            "Rótulo": g.Rótulo,
            "Precio Gasolina 95 E5" : g["Precio Gasolina 95 E5"]
            };
    });

    res.json(gas);
}

exports.findCheaperInLocalidad = (req, res) => {

    const localidad = req.params.localidad.toUpperCase();

    const tipoGasolina = "Precio " + req.params.tipoGasolina;

    let gas = Gas.ListaEESSPrecio.filter( g => g.Localidad == localidad);

    let min = gas[0][tipoGasolina];

    gas.forEach(g => {
        if(min > g[tipoGasolina] && g[tipoGasolina] != ""){
            min = g[tipoGasolina];
        }
    });

    gas = gas.filter(g => g[tipoGasolina] == min).map(g => {
        return {
            "Dirección": g.Dirección,
            "Rótulo": g.Rótulo,
            tipoGasolina : g[tipoGasolina]
            };
    });


    res.json(gas);

}

exports.findCoordinates = (req, res) => {

    const latitud = Number(req.params.latitud);
    const longitud = Number(req.params.longitud);
    const numeroDeGasolineras = Number(req.params.numeroDeGasolineras);

    const gas = Gas.ListaEESSPrecio.map(g => {
        const latitudGas = Number(g["Latitud"].replace(',', '.'));
        const longitudGas = Number(g["Longitud (WGS84)"].replace(',', '.'));
            return {    
                "Dirección": g.Dirección,
                "Rótulo": g.Rótulo,
                "Precio Gasolina 95 E5" : g["Precio Gasolina 95 E5"],
                "Latitud": g.Latitud,
                "Longitud": g["Longitud (WGS84)"],
                "Distancia" : calcularDistanciaEntreDosCoordenadas(latitudGas, longitudGas, latitud, longitud)
                };
        }).sort(
            (gas1, gas2) => {
                return gas1["Distancia"] - gas2["Distancia"]
            }
        ).slice(0,numeroDeGasolineras)

    res.json(gas);

}

exports.findCoordinatesByDegreeOfApproximation = (req, res) => {

    const latitud = Number(req.params.latitud);
    const longitud = Number(req.params.longitud);
    const gradoAproximacion = Number(req.params.gradoAproximacion);

    const gas = Gas.ListaEESSPrecio.filter( g => {
            const latitudGas = g["Latitud"].replace(',', '.');
            const longitudGas = g["Longitud (WGS84)"].replace(',', '.');
            return (
                Number(latitudGas) + gradoAproximacion >= latitud &&
                Number(latitudGas) - gradoAproximacion <= latitud &&
                Number(longitudGas) + gradoAproximacion >= longitud && 
                Number(longitudGas) - gradoAproximacion <= longitud)
        }).map(g => {
            const latitudGas = Number(g["Latitud"].replace(',', '.'));
            const longitudGas = Number(g["Longitud (WGS84)"].replace(',', '.'));
            return {    
                "Dirección": g.Dirección,
                "Rótulo": g.Rótulo,
                "Precio Gasolina 95 E5" : g["Precio Gasolina 95 E5"],
                "Latitud": latitudGas,
                "Longitud": longitudGas,
                "Distancia" : calcularDistanciaEntreDosCoordenadas(latitudGas, longitudGas, latitud, longitud)
                };
        }).sort(
            (gas1, gas2) => {
                return gas1["Distancia"] - gas2["Distancia"]
            }
        )

    res.json(gas);

}

const calcularDistanciaEntreDosCoordenadas = (lat1, lon1, lat2, lon2) => {
    // Convertir todas las coordenadas a radianes
    lat1 = gradosARadianes(lat1);
    lon1 = gradosARadianes(lon1);
    lat2 = gradosARadianes(lat2);
    lon2 = gradosARadianes(lon2);
    // Aplicar fórmula
    const RADIO_TIERRA_EN_KILOMETROS = 6371;
    let diferenciaEntreLongitudes = (lon2 - lon1);
    let diferenciaEntreLatitudes = (lat2 - lat1);
    let a = Math.pow(Math.sin(diferenciaEntreLatitudes / 2.0), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(diferenciaEntreLongitudes / 2.0), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return RADIO_TIERRA_EN_KILOMETROS * c;
};
const gradosARadianes = (grados) => {
    return grados * Math.PI / 180;
};