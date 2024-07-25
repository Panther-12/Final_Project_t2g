"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registrationController_1 = require("../controllers/registrationController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post('/', auth_1.authenticateToken, registrationController_1.registrationController.registerUserForEvent);
router.get('/', auth_1.isAdmin, registrationController_1.registrationController.getAllRegistrations);
router.get('/:id', auth_1.authenticateToken, registrationController_1.registrationController.getRegistrationById);
router.put('/:id', auth_1.authenticateToken, registrationController_1.registrationController.updateRegistration);
router.delete('/:id', auth_1.authenticateToken, registrationController_1.registrationController.deleteRegistration);
router.get('/user/:userId', auth_1.authenticateToken, registrationController_1.registrationController.getAllRegistrationsForUser);
router.get('/organizer/:organizerId', auth_1.isOrganizer, registrationController_1.registrationController.getAllRegistrationsByOrganizer);
exports.default = router;
