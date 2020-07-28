const express = require("express"),
	router = express.Router();
const { scedule_list, scedule_create, scedule_update, scedule_delete } = require("../controllers/sceduleController");
/**
 * todo validatie en authorisatie implementeren
 */

/**
 * Method: GET
 * Purpose: retrieve all scedle
 */
router.get("/", scedule_list);

/**
 * Method: POST
 * Purpose: Add a scedule/ list of scedule
 */
router.post("/", scedule_create);

/**
 * Method: PATCH/:id
 * Purpose: Update a single or a list of scedule
 */
router.patch("/:id", scedule_update);

/**
 * Method: Delete/:id
 * Purpose: Delete a single or a list of scedule
 */
router.delete("/:id", scedule_delete);

module.exports = router;
