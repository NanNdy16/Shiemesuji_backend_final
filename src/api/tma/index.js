const authCh = require('../../middleware/authCh');

module.exports = (app) => {
  app.get('/api/tma/dashboard', authTma, (req, res) => {
    res.json({
      message: 'Dashboard TMA',
      pos: req.session.tma.nama_pos
    });
  });
};
