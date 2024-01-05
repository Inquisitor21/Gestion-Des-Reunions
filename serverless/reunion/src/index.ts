import {SimpleBaseService} from "./common/baseserver";

// IMPORTANT : IF YOU NEED TO MODIFY baseserver.ts or bigquery.ts you MUST TEST OTHER SERVICE AND ALIGN ALL OF THEM

class MyAPI extends SimpleBaseService {
    // Effectue la request, typiquement la seule place a modifier.
    async execute() {
        // Look at the method and call the right function
        switch (this.req.method) {
            case "GET":
                await this.execute_get();
                break;
            case "POST":
                if (this.req.query.id && this.req.body.participant) {
                    await this.execute_post_with_participant();
                } else {
                    await this.execute_post();
                }
                break;
            case "PUT":
                await this.execute_updateDate();
                break;
            case "DELETE":
                await this.execute_delete();
                break;
            default:
                throw ({error: 400, msg: "Méthode non supportée"});
        }
    }

    async execute_post() {
        let colonnes: {
            createur_nom: string,
            createur_prenom: string,
            createur_email: string,
            reunion_id: string
            participants: [{
                nom: string,
                prenom: string,
                disponnible: string
            }],
            date_debut: string,
            date_fin: string,
            description: string
        } = this.req.body;

        console.log(colonnes);
        console.log(this.req.body);

        await this.myDB.insertDBNoBuffer('reunions', colonnes);

        this.send_success(this.res, {"success": true});
    }

    async execute_get() {
        const result = await this.myDB.queryDB({
            table: 'reunions',
        });

        this.send_success(this.res, result);
    }

    async execute_post_with_participant() {
        const participant = this.req.body.participant;

        const query = `
               UPDATE tp3-vazgen-markaryan.web.reunions
               SET participants = ARRAY_CONCAT(participants, [STRUCT('${participant.nom}', '${participant.prenom}', '${participant.disponnible}')])
               WHERE reunion_id = '${this.req.query.id}'`;

        await this.myDB.queryDBRaw(query);

        this.send_success(this.res, {"success": true});
    }

    async execute_updateDate() {

        let myStartDate: string = this.req.query.startDate;
        let myEndDate: string = this.req.query.endDate;
        let myReunion_id: string = this.req.query.reunion_id;

        const query = `UPDATE tp3-vazgen-markaryan.web.reunions
                              SET date_debut = '${myStartDate}', date_fin = '${myEndDate}'
                              WHERE reunion_id = '${myReunion_id}'`;

        await this.myDB.queryDBRaw(query);

        this.send_success(this.res, {"success": true});
        this.send_success(this.res, { "success": true, "message": query });
    }

    async execute_delete() {
        const reunion_id = this.req.query.id;

        const query = `DELETE FROM tp3-vazgen-markaryan.web.reunions
                              WHERE reunion_id = '${reunion_id}'`;

        await this.myDB.queryDBRaw(query);

        this.send_success(this.res, {"success": true});
    }
}

export const myapiservice = (req, res) => {
    const myService = new MyAPI(req, res, "POST,GET,PUT,DELETE");
    myService.perform_execute();
}
