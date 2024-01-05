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
exports.BigQueryMgr = void 0;
const bigquery_1 = require("@google-cloud/bigquery");
const constantes_1 = require("./constantes");
/*
IMPORTANT LES RÉPERTOIRES COMMON SONT COPIÉS LORS DU BUILD NE PAS MODIFIER LA VERSION LOCAL
SI VOUS DEVEZ FAIRE DES CHANGEMENTS VOUS DEVEZ CHANGER CES FICHIERS DANS LE RÉPERTOIRE COMMON
QUI SE TROUVE À LA RACINE DU PROJET
*/
class BigQueryMgr {
    constructor() {
        this.bigquery = new bigquery_1.BigQuery();
        this.projet = constantes_1.CONFIGURATION.PROJET;
        this.location = constantes_1.CONFIGURATION.REGIONLOCATION;
        this.dataset = constantes_1.CONFIGURATION.DATASET;
    }
    simpleTestQ(query) {
        //console.log('Checking query', query);
        const regex = /(\-\-|\;)/g;
        const found = query.match(regex);
        if (found)
            return true;
        return false;
    }
    queryDBRaw(queryRaw) {
        return __awaiter(this, void 0, void 0, function* () {
            // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
            const options = {
                query: queryRaw,
                // Location must match that of the dataset(s) referenced in the query.
                location: this.location,
            };
            // Run the query as a job
            const [job] = yield this.bigquery.createQueryJob(options);
            // Wait for the query to finish
            const [rows] = yield job.getQueryResults();
            return rows;
        });
    }
    queryDB({ table, fields = '*', where, limit = 100, skip = 0, extra, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO Sanitize
            let query = `SELECT ${fields}
        FROM \`${this.dataset}.${table}\``;
            if (where) {
                query += ` WHERE ${where}`;
            }
            query += ` LIMIT ${limit}`;
            if (this.simpleTestQ(query)) {
                throw ('Invalid query element');
            }
            query += ';';
            // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
            const options = {
                query: query,
                // Location must match that of the dataset(s) referenced in the query.
                location: this.location,
            };
            // Run the query as a job
            const [job] = yield this.bigquery.createQueryJob(options);
            //console.log(`Job ${job.id} started.`);
            // Wait for the query to finish
            const [rows] = yield job.getQueryResults();
            return rows;
        });
    }
    updateDB({ table, field, where, value // Should be quoted if string values
     }) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO Sanitize ${fields}
            let query = `UPDATE \`${this.dataset}.${table}\``;
            query += ` SET ${field}=${value}`;
            if (where) {
                query += ` WHERE ${where}`;
            }
            if (this.simpleTestQ(query)) {
                throw ('Invalid query element');
            }
            query += ';';
            // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
            const options = {
                query: query,
                // Location must match that of the dataset(s) referenced in the query.
                location: this.location,
                // location: 'US',
            };
            // Run the query as a job
            const [job] = yield this.bigquery.createQueryJob(options);
            // Wait for the query to finish
            const [rows] = yield job.getQueryResults();
            return rows;
        });
    }
    deleteDB({ table, where, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO Sanitize
            let query = `DELETE FROM \`${this.dataset}.${table}\``;
            if (where) {
                query += ` WHERE ${where}`;
            }
            if (this.simpleTestQ(query)) {
                throw ('Invalid query element');
            }
            query += ';';
            // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
            const options = {
                query: query,
                // Location must match that of the dataset(s) referenced in the query.
                location: this.location,
                // location: 'US',
            };
            // Run the query as a job
            const [job] = yield this.bigquery.createQueryJob(options);
            console.log(`Job ${job.id} started.`);
            // Wait for the query to finish
            const [rows] = yield job.getQueryResults();
            return rows;
        });
    }
    insertDB(table, row) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bigquery.dataset(this.dataset).table(table).insert(row);
        });
    }
    insertDBNoBuffer(table, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const toInsert = JSON.stringify(values);
            const myInsString = toInsert.substring(1, toInsert.length - 1);
            yield this.queryDBRaw(`insert into \`${this.dataset}.${table}\` values (${myInsString});`);
        });
    }
    getSchema(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const [metadata] = yield this.bigquery.dataset(this.dataset).table(table).getMetadata();
            return metadata;
        });
    }
}
exports.BigQueryMgr = BigQueryMgr;
