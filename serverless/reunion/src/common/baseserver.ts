import { Request, Response } from 'express';
import { BigQueryMgr } from './bigquery';

/*
IMPORTANT LES RÉPERTOIRES COMMON SONT COPIÉS LORS DU BUILD NE PAS MODIFIER LA VERSION LOCAL
SI VOUS DEVEZ FAIRE DES CHANGEMENTS VOUS DEVEZ CHANGER CES FICHIERS DANS LE RÉPERTOIRE COMMON 
QUI SE TROUVE À LA RACINE DU PROJET
*/

export abstract class SimpleBaseService {
    unsecure: boolean = false;
    myDB = new BigQueryMgr()

    constructor(
        public req,
        public res,
        public methodes = "GET"
    ) {
        // Met en place les operation commune.
        this.res.header("Access-Control-Allow-Origin", "*");
        //res.header("Access-Control-Allow-Origin", "http://localhost:4200");
        //this.req.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
        this.res.header("Access-Control-Allow-Methods", methodes + ",OPTIONS");
        this.res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    }

    async perform_execute() {

        if (this.req.method === 'OPTIONS') {
            // Send response to OPTIONS requests
            await this.res.status(204).send('');
            return;
        }

        const currentMethod = ((this.req.method) as string).toLocaleUpperCase();
        if (this.methodes.split(',').findIndex(
            (a) => (a.toLocaleUpperCase() === currentMethod)
        ) == -1) {
            this.send_failure(
                this.res,
                405,
                this.make_error(
                    "error",
                    "Method Not Allowed"
                )
            )
        } else {
            try {
                await this.execute();
            } catch (e: any) {
                console.log(JSON.stringify(e));
                if (e['error'] > 0) {
                    const erreur = this.make_error("error", e['msg']);
                    this.send_failure(this.res, e['error'], erreur);
                } else {
                    const erreur = this.make_error("error", e || "Could not fetch data");
                    this.send_failure(this.res, 500, erreur);
                }
            }
        }
    }

    make_error(err: string, msg: string) {
        var e: Error = new Error(msg);
        return e;
    }

    send_success(res: Response, data: any) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data) + "\n");
    }

    send_failure(res: Response, server_code: number, err: Error) {
        //var code = (err.code) ? err.code : err.name;
        const code = 0;
        res.writeHead(server_code, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
    }

    async checkToken(authorization: string = ''): Promise<string> {

        // Look for 4 hour only
        const lH = new Date(new Date().getTime() - ((4 * 60) * 60000));
        const lastHourString = `${lH.getUTCFullYear()}-${lH.getUTCMonth() + 1}-${lH.getUTCDate()} ${lH.getUTCHours()}:${lH.getUTCMinutes()}:${lH.getSeconds()}`;

        const token = await this.myDB.queryDB(
            {
                table: 'sessions',
                where: `token = '${authorization}'
                and create_date > '${lastHourString}'`
            }
        )

        console.log("Tokens:", token)

        return token[0]?.userid || '';
    }

    // Effectue la request, typiquement la seule place a modifier.
    abstract execute();
}



