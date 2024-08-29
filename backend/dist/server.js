"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const tme_1 = __importDefault(require("./routes/tme")); // Importation des routes TME
console.log("Starting server...");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 7000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
(0, typeorm_1.createConnection)().then(() => {
    console.log("Database connection established");
    // Routes d'authentification
    app.use('/auth', auth_1.default);
    // Routes d'administration
    app.use('/admin', admin_1.default);
    // Routes pour TME
    app.use('/tme', tme_1.default);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error("Error during database connection: ", error);
});
//# sourceMappingURL=server.js.map