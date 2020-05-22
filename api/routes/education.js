const express = require('express'),
    router = express.Router();

const educations = require("../models/courses/education");


const educations_controller = require("../controllers/educationController"),
    {
        educationValidationRules,
        validate
    } = require("../middleware/form_validations/educationValidation");


/// Education ROUTES ///

router.get("/", educations_controller.education_list);

router.post("/", educationValidationRules(), validate, educations_controller.education_create);

// Delete All Education
router.delete("/", educations_controller.education_delete_list);


///////////////////////////////////////////////

// Get single education
router.get("/:id", educations_controller.education_detail);

// Update single course
router.patch("/:id", educations_controller.education_update);

// Delete single course
router.delete("/:id",educations_controller.education_delete);

module.exports = router;