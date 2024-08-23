import express, { Request, Response } from "express"; 
const app = express();
const projectRouter = require('./src/routes'); 
 
app.use('/', projectRouter);  

const PORT = process.env.PORT || 6666;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 