import { SimpleBaseService } from "./common/baseserver";

// IMPORTANT : IF YOU NEED TO MODIFY baseserver.ts or bigquery.ts you MUST TEST OTHER SERVICE AND ALIGN ALL OF THEM
const secret = "secret";

class MyAPI extends SimpleBaseService {
     // Effectue la request, typiquement la seule place a modifier.

     async execute() {

        if (this.req.query.table == null) {
            throw ({ error: 400, msg: "Table manquante" });
        }

        if (this.req.query.clef == null ||
            this.req.query.clef != secret) {
            throw ({ error: 400, msg: "Clef manquante ou invalide" });
        }

        if (this.req.query.mode == null) {
            throw ({ error: 400, msg: "Mode manquante" });
        }

        const table = this.req.query.table;
        const mode = this.req.query.mode;
        let data;

        if ( mode === "schema" ) {
            data = await this.myDB.getSchema(table);
        } else if ( mode === "data" ) {
            data = await this.myDB.queryDB(
                {
                    table: table,
                    fields: `*`,
                }
            );
        } else {
            throw ({ error: 400, msg: "Mode invalide" });
        }


         this.send_success(this.res, data || data[0]);
     }
}

export const myapiservice = (req, res) => {
    const myService = new MyAPI(req, res);
    myService.perform_execute();
}
