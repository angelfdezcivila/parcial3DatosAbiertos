const express = require( 'express' );
const gas = require('../controllers/gas.controller.js');
const router = express.Router();

// Retrieve all gas
router.get('/', gas.findAll);

// Retrieve all gas by localidad
router.get('/:localidad', gas.findByLocalidad);

// Retrieve the most cheappest gas
router.get('/:tipoGasolina/:localidad', gas.findCheaperInLocalidad);

// Retrieve n closest gas by longitud and latitud
router.get('/:latitud/:longitud/:numeroDeGasolineras', gas.findCoordinates);

// Retrieve all gas by longitud and latitud
router.get('/gradoAproximacion/:latitud/:longitud/:gradoAproximacion', gas.findCoordinatesByDegreeOfApproximation);


module.exports = router;