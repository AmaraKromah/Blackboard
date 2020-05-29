const express = require("express"),
	router = express.Router();

const {
		education_list,
		education_create,
		education_detail,
		education_update,
		education_delete,
		education_delete_list
	} = require("../controllers/educationController"),
	{ educationValidationRules, validate } = require("../middleware/form_validations/educationValidation");

/// Education ROUTES ///

router.get("/", education_list);

router.post("/", educationValidationRules(), validate, education_create);

//# Delete All Education (to implement)
router.delete("/", education_delete_list);

///////////////////////////////////////////////

// Get single education
router.get("/:id", education_detail);

// Update single course
router.patch("/:id", education_update);

// Delete single course
router.delete("/:id", education_delete);

module.exports = router;
