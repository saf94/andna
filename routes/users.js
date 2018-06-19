var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/bio', function(req, res) {
  // console.log("res", res)
  res.sendFile(path.join(__dirname + '../public/bio.html'));
})

module.exports = router;
