import { SimpleBaseService } from "./common/baseserver";

// IMPORTANT : IF YOU NEED TO MODIFY baseserver.ts or bigquery.ts you MUST TEST OTHER SERVICE AND ALIGN ALL OF THEM

class MyAPI extends SimpleBaseService {
     // Effectue la request, typiquement la seule place a modifier.
     async execute() {
        // TODO Add Page and skip parameters
        const lH = new Date(new Date().getTime() - ((1 * 60) * 60000));
        const lastHourString = `${lH.getUTCFullYear()}-${lH.getUTCMonth() + 1}-${lH.getUTCDate()} ${lH.getUTCHours()}:${lH.getUTCMinutes()}:${lH.getSeconds()}`;

        const data = await this.myDB.queryDBRaw(
            `SELECT 
            username
             FROM \`cegep-al.services345A22.users\` 
             LIMIT 1000;`
        );

        this.send_success(this.res, data || data[0]);
     }
}

export const myapiservice = (req, res) => {
    const myService = new MyAPI(req, res);
    myService.perform_execute();
}
