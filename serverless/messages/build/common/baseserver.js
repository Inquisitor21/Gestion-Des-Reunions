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
exports.SimpleBaseService = void 0;
const bigquery_1 = require("./bigquery");
/*
IMPORTANT LES RÉPERTOIRES COMMON SONT COPIÉS LORS DU BUILD NE PAS MODIFIER LA VERSION LOCAL
SI VOUS DEVEZ FAIRE DES CHANGEMENTS VOUS DEVEZ CHANGER CES FICHIERS DANS LE RÉPERTOIRE COMMON
QUI SE TROUVE À LA RACINE DU PROJET
*/
class SimpleBaseService {
    constructor(req, res, methodes = "GET") {
        this.req = req;
        this.res = res;
        this.methodes = methodes;
        this.unsecure = false;
        this.myDB = new bigquery_1.BigQueryMgr();
        // Met en place les operation commune.
        this.res.header("Access-Control-Allow-Origin", "*");
        //res.header("Access-Control-Allow-Origin", "http://localhost:4200");
        //this.req.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
        this.res.header("Access-Control-Allow-Methods", methodes + ",OPTIONS");
        this.res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    }
    perform_execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.req.method === 'OPTIONS') {
                // Send response to OPTIONS requests
                yield this.res.status(204).send('');
                return;
            }
            const currentMethod = (this.req.method).toLocaleUpperCase();
            if (this.methodes.split(',').findIndex((a) => (a.toLocaleUpperCase() === currentMethod)) == -1) {
                this.send_failure(this.res, 405, this.make_error("error", "Method Not Allowed"));
            }
            else {
                try {
                    yield this.execute();
                }
                catch (e) {
                    console.log(JSON.stringify(e));
                    if (e['error'] > 0) {
                        const erreur = this.make_error("error", e['msg']);
                        this.send_failure(this.res, e['error'], erreur);
                    }
                    else {
                        const erreur = this.make_error("error", e || "Could not fetch data");
                        this.send_failure(this.res, 500, erreur);
                    }
                }
            }
        });
    }
    make_error(err, msg) {
        var e = new Error(msg);
        return e;
    }
    send_success(res, data) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data) + "\n");
    }
    send_failure(res, server_code, err) {
        //var code = (err.code) ? err.code : err.name;
        const code = 0;
        res.writeHead(server_code, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
    }
    checkToken(authorization = '') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Look for 4 hour only
            const lH = new Date(new Date().getTime() - ((4 * 60) * 60000));
            const lastHourString = `${lH.getUTCFullYear()}-${lH.getUTCMonth() + 1}-${lH.getUTCDate()} ${lH.getUTCHours()}:${lH.getUTCMinutes()}:${lH.getSeconds()}`;
            const token = yield this.myDB.queryDB({
                table: 'sessions',
                where: `token = '${authorization}'
                and create_date > '${lastHourString}'`
            });
            console.log("Tokens:", token);
            return ((_a = token[0]) === null || _a === void 0 ? void 0 : _a.userid) || '';
        });
    }
}
exports.SimpleBaseService = SimpleBaseService;
