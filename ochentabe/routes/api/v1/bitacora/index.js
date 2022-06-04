const express = require('express');
const router = express.Router();
const Bitacora = require('../../../../libs/bitacora');
const BitacoraDao = require('../../../../dao/models/BitacoraDao');
const bitaDao = new CategoryDao();
const bita = new Category(bitaDao);
bita.init();

router.get('/', async (req, res) => {
  // extraer y validar datos del request
  try {
    // devolver la ejecución el controlador de esta ruta
    const versionData = await bita.getVersion();
    return res.status(200).json(versionData);
  } catch (ex) {
    // manejar el error que pueda tirar el controlador
    console.error('Error bitacora', ex);
    return res.status(502).json({ 'error': 'Error Interno de Server' });
  }
}); // get /

router.get('/all', async (req, res) => {
  try {
    const bitacoras = await bita.getBitacora();
    return res.status(200).json(bitacoras);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
});

router.get('/byid/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({
        error: 'Se espera un codigo numérico'
      });
    }
    const registro = await bita.getBitacoraById({ codigo: parseInt(codigo) });
    return res.status(200).json(registro);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
});

router.post('/new', async (req, res) => {
  try {
    const { description = '',
      type = '',
      date = '',
      amount = '',
      category = '' } = req.body;
    if (/^\s*$/.test(description)) {
      return res.status(400).json({
        error: 'Se espera valor de descripcion'
      });
    }

    if (/^\s*$/.test(type)) {
      return res.status(400).json({
        error: 'Se espera valor de type'
      });
    }
    if (/^\s*$/.test(date)) {
      return res.status(400).json({
        error: 'Se espera url de date'
      });
    }
    if (/^\s*$/.test(amount)) {
      return res.status(400).json({
        error: 'Se espera valor de decimal'
      });
    }
    if (/^\s*$/.test(category)) {
      return res.status(400).json({
        error: 'Se espera valor de Categoria'
      });
    }
    const newbitacora = await bita.addBitacora({
      description,
      type,
      date,
      amount,
      category
    });
    return res.status(200).json(newbitacora);
  } catch (ex) {
    console.error(ex);
    return res.status(502).json({ error: 'Error al procesar solicitud' });
  }
});

router.put('/update/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
    }
    const { description,type,date,amount, category } = req.body;
    if (/^\s*$/.test(description,type,date,amount, category)) {
      return res.status(400).json({
        error: 'Se espera valor de categoría'
      });
    }
    

    const updateResult = await bita.updatedBitacora({ codigo: parseInt(codigo), description,type,date,amount, category });

    if (!updateResult) {
      return res.status(404).json({ error: 'Bitacora no encontrada.' });
    }
    return res.status(200).json({ updatedBitacora: updateResult });

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});


router.delete('/delete/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
    }

    const deletedBitacora = await bita.deletedBitacora({ codigo: parseInt(codigo) });

    if (!deletedBitacora) {
      return res.status(404).json({ error: 'Bitacora no encontrada.' });
    }
    return res.status(200).json({ deletedBitacora });

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});

module.exports = router;