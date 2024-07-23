"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const venuController_1 = require("../controllers/venuController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/', venuController_1.venueController.getAllVenues);
router.get('/:id', venuController_1.venueController.getVenueById);
router.post('/', auth_1.isAdmin, venuController_1.venueController.createVenue);
router.put('/:id', auth_1.isAdmin, venuController_1.venueController.updateVenue);
router.delete('/:id', auth_1.isAdmin, venuController_1.venueController.deleteVenue);
exports.default = router;
