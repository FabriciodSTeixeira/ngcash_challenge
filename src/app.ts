import { AppDataSource } from "./database/datasource";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";


AppDataSource.initialize()
    .then(()=>{
        const app = express();
        const port = process.env.PORT || 3535;
        app.use(cors());
        app.use(helmet());
        app.use(express.json());
        app.use(routes);

        app.listen(port, () =>{
            console.log(`Server started on port ${port}`);
         });
    })
    .catch((error)=>console.log(error));




