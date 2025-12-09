import express from 'express';
import {
  muestraProveedores,
  muestraProveedor,
  insertaProveedor,
  actualizaProveedor,
  eliminaProveedor
} from '../controladores/proveedorControlador.js';

const rutas = express.Router();

rutas.get('/proveedores', muestraProveedores);
rutas.get('/proveedores/:id', muestraProveedor);
rutas.post('/proveedores', insertaProveedor);
rutas.put('/proveedores/:id', actualizaProveedor);
rutas.delete('/proveedores/:id', eliminaProveedor);

export default rutas;