import { SimpleBaseService } from "./common/baseserver";

// IMPORTANT : IF YOU NEED TO MODIFY baseserver.ts or bigquery.ts you MUST TEST OTHER SERVICE AND ALIGN ALL OF THEM

class MyAPI extends SimpleBaseService {
    // Effectue la request, typiquement la seule place a modifier.
    async execute() {
        // Get a request for a token, should have a username and password
        // Will return a token that will be valid for one hour
        // console.log("Got REQ", this.req);
        // console.log("Got", this.req.body);
        //var token_request = JSON.parse(JSON.stringify(req.body));

        let username = this.req.body.username;
        let password = this.req.body.password;

        // Generate a hash code from the user password
        // TODO: Should improve hashing with username but would prevent changing password.
        let crypto = require('crypto');
        let hash = crypto.createHash('sha256');
        let code = hash.update("mysaltis42" + password);
        code = hash.digest('hex');

        const users = await this.myDB.queryDB(
            {
                table: 'users',
                where: `username = '${username}'`
            }
        )
        // Validate 
        console.log("Got for user:", users);
        if (users.length === 1) {
            if (this.unsecure === true || users[0].hash === code) {
                let crypto = require('crypto');
                let hash3 = crypto.createHash('sha256');
                let code2 = hash3.update("mysaltistime" + new Date().getTime());
                code2 = hash3.digest('hex');

                // Add to the valid tokens for the session
                console.log("Session token is", code2);
                await this.myDB.insertDB('sessions', [
                    {
                        'token': code2,
                        'userid': username, // Would be better to user ID but Bigquery is not good for reinsert in case of change of password
                        'create_date': new Date()
                    }
                ])
                /*
                _live_tokens[code2] = {
                    username: username,
                    'expiration': new Date().getTime() + (36000 * 4 * 60)
                    //'expiration': new Date().getTime()+(60000) // Une minute
                };
                */
                this.send_success(this.res, code2);
            } else {
                throw ({ error: 401, msg: "Utilisateur ou mot de pass invalide" });
            }
        } else {
            throw ({ error: 401, msg: "Utilisateur ou mot de pass invalide" });
        }
    }
}

export const myapiservice = (req, res) => {
    const myService = new MyAPI(req, res, "POST");
    myService.perform_execute();
}
