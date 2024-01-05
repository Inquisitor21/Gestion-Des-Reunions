"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myapiservice = void 0;
const baseserver_1 = require("./common/baseserver");
// IMPORTANT : IF YOU NEED TO MODIFY baseserver.ts or bigquery.ts you MUST TEST OTHER SERVICE AND ALIGN ALL OF THEM
class MyAPI extends baseserver_1.SimpleBaseService {
    // Effectue la request, typiquement la seule place a modifier.
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            // Look at the method and call the right function
            switch (this.req.method) {
                case "GET":
                    yield this.execute_get();
                    break;
                case "POST":
                    if (this.req.query.id && this.req.body.participant) {
                        yield this.execute_post_with_participant();
                    }
                    else {
                        yield this.execute_post();
                    }
                    break;
                case "PUT":
                    yield this.execute_updateDate();
                    break;
                case "DELETE":
                    yield this.execute_delete();
                    break;
                default:
                    throw ({ error: 400, msg: "Méthode non supportée" });
            }
        });
    }
    execute_post() {
        return __awaiter(this, void 0, void 0, function* () {
            let colonnes = this.req.body;
            console.log(colonnes);
            console.log(this.req.body);
            yield this.myDB.insertDBNoBuffer('reunions', colonnes);
            this.send_success(this.res, { "success": true });
        });
    }
    execute_get() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.myDB.queryDB({
                table: 'reunions',
            });
            this.send_success(this.res, result);
        });
    }
    execute_post_with_participant() {
        return __awaiter(this, void 0, void 0, function* () {
            const participant = this.req.body.participant;
            const query = `
               UPDATE tp3-vazgen-markaryan.web.reunions
               SET participants = ARRAY_CONCAT(participants, [STRUCT('${participant.nom}', '${participant.prenom}', '${participant.disponnible}')])
               WHERE reunion_id = '${this.req.query.id}'`;
            yield this.myDB.queryDBRaw(query);
            this.send_success(this.res, { "success": true });
        });
    }
    execute_updateDate() {
        return __awaiter(this, void 0, void 0, function* () {
            let myStartDate = this.req.query.startDate;
            let myEndDate = this.req.query.endDate;
            let myReunion_id = this.req.query.reunion_id;
            const query = `UPDATE tp3-vazgen-markaryan.web.reunions
                              SET date_debut = '${myStartDate}', date_fin = '${myEndDate}'
                              WHERE reunion_id = '${myReunion_id}'`;
            yield this.myDB.queryDBRaw(query);
            this.send_success(this.res, { "success": true });
            this.send_success(this.res, { "success": true, "message": query });
        });
    }
    execute_delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const reunion_id = this.req.query.id;
            const query = `DELETE FROM tp3-vazgen-markaryan.web.reunions
                              WHERE reunion_id = '${reunion_id}'`;
            yield this.myDB.queryDBRaw(query);
            this.send_success(this.res, { "success": true });
        });
    }
}
const myapiservice = (req, res) => {
    const myService = new MyAPI(req, res, "POST,GET,PUT,DELETE");
    myService.perform_execute();
};
exports.myapiservice = myapiservice;
