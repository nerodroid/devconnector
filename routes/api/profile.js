const express = require('express');
const router = express.Router();


//@route GET api/posts/profile
//@desc Tests profile route
//@access public
router.get('/test', (req, res) => res.json({ msg: "Profile Works" }));

module.exports = router;