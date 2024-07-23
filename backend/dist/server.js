"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dbUtils_1 = require("./utils/dbUtils");
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const venueRoutes_1 = __importDefault(require("./routes/venueRoutes"));
const registrationRoutes_1 = __importDefault(require("./routes/registrationRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
// Routes
app.use('/users', userRoutes_1.default);
app.use('/venues', venueRoutes_1.default);
app.use('/registration', registrationRoutes_1.default);
app.use('/events', eventRoutes_1.default);
app.use('/categories', categoryRoutes_1.default);
app.use('/tickets', ticketRoutes_1.default);
// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
// Test database connection on server start
(0, dbUtils_1.testDatabaseConnection)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Failed to start server:', error);
});
