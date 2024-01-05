import { BigQuery } from '@google-cloud/bigquery';
import { CONFIGURATION } from './constantes';

/*
IMPORTANT LES RÉPERTOIRES COMMON SONT COPIÉS LORS DU BUILD NE PAS MODIFIER LA VERSION LOCAL
SI VOUS DEVEZ FAIRE DES CHANGEMENTS VOUS DEVEZ CHANGER CES FICHIERS DANS LE RÉPERTOIRE COMMON
QUI SE TROUVE À LA RACINE DU PROJET
*/

export class BigQueryMgr {
    bigquery = new BigQuery();
    projet = CONFIGURATION.PROJET;
    location= CONFIGURATION.REGIONLOCATION;
    dataset = CONFIGURATION.DATASET;

    simpleTestQ(query: string): boolean {
        //console.log('Checking query', query);
        const regex = /(\-\-|\;)/g;
        const found = query.match(regex);

        if (found) return true;

        return false;
    }

    async queryDBRaw(
        queryRaw: string) {


      // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
      const options = {
        query: queryRaw,
        // Location must match that of the dataset(s) referenced in the query.
        location: this.location,
      };

      // Run the query as a job
      const [job] = await this.bigquery.createQueryJob(options);

      // Wait for the query to finish
      const [rows] = await job.getQueryResults();

      return rows;

    }

    async queryDB(
        {
            table,
            fields='*',
            where,
            limit=100,
            skip=0,
            extra,
        }: {
            table: string;
            fields?: string;
            where?: string;
            limit?: number;
            skip?: number;
            extra?: string | undefined
        }) {
        // TODO Sanitize

        let query = `SELECT ${fields}
        FROM \`${this.dataset}.${table}\``

        if (where) {
            query += ` WHERE ${where}`
        }

        query += ` LIMIT ${limit}`;

        if (this.simpleTestQ(query)) {
            throw('Invalid query element');
        }

        query += ';';

      // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
      const options = {
        query: query,
        // Location must match that of the dataset(s) referenced in the query.
        location: this.location,
      };

      // Run the query as a job
      const [job] = await this.bigquery.createQueryJob(options);
      //console.log(`Job ${job.id} started.`);

      // Wait for the query to finish
      const [rows] = await job.getQueryResults();

      return rows;

    }

    async updateDB(
        {
            table,
            field,
            where,
            value // Should be quoted if string values

        }: {
            table: string;
            field: string;
            where?: string;
            value: string;
        }) {

        // TODO Sanitize ${fields}

        let query = `UPDATE \`${this.dataset}.${table}\``

        query += ` SET ${field}=${value}`;

        if (where) {
            query += ` WHERE ${where}`
        }

        if (this.simpleTestQ(query)) {
            throw('Invalid query element');
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
      const [job] = await this.bigquery.createQueryJob(options);

      // Wait for the query to finish
      const [rows] = await job.getQueryResults();

      return rows;

    }

    async deleteDB(
        {
            table,
            where,
        }: {
            table: string;
            where?: string;
        }) {

            // TODO Sanitize

        let query = `DELETE FROM \`${this.dataset}.${table}\``

        if (where) {
            query += ` WHERE ${where}`
        }

        if (this.simpleTestQ(query)) {
            throw('Invalid query element');
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
      const [job] = await this.bigquery.createQueryJob(options);
      console.log(`Job ${job.id} started.`);

      // Wait for the query to finish
      const [rows] = await job.getQueryResults();

      return rows;

    }

    async insertDB(table: string, row: any) {
        await this.bigquery.dataset(this.dataset).table(table).insert(row);
    }

    async insertDBNoBuffer(table: string, values: {
        createur_nom: string,
        createur_prenom: string,
        createur_email:string,
        reunion_id:string
        participants: [{
            nom: string,
            prenom: string,
            disponnible:string
        }],
        date_debut: string,
        date_fin: string,
        description: string
    }) {
        const strInsParticipant = `STRUCT('${values.participants[0].nom}','${values.participants[0].prenom}','${values.participants[0].disponnible}')`;
        const monReunion =
            `'${values.createur_nom}',
             '${values.createur_prenom}',
             '${values.createur_email}',
             '${values.reunion_id}',
              [${strInsParticipant}],
             '${values.date_debut}',
             '${values.date_fin}',
             '${values.description}'`;
        console.log(monReunion);
        await this.queryDBRaw(
            `insert into \`${this.dataset}.${table}\` values (${monReunion});`
        );
    }

    async getSchema(table: string) {
        const [metadata] = await this.bigquery.dataset(this.dataset).table(table).getMetadata();
        return metadata;
    }
}
