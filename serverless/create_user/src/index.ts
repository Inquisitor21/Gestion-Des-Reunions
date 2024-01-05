import { SimpleBaseService } from "./common/baseserver";

// IMPORTANT : IF YOU NEED TO MODIFY baseserver.ts or bigquery.ts you MUST TEST OTHER SERVICE AND ALIGN ALL OF THEM

class MyAPI extends SimpleBaseService {
     // Effectue la request, typiquement la seule place a modifier.
     async execute() {
         // Get a request for a token, should have a username and password
        // Will return a token that will be valid for one hour
        //var token_request = JSON.parse(JSON.stringify(req.body));

        let username = this.req.body.username;
        let password = this.req.body.password;
        let email = this.req.body.email;
        let clef = this.req.body.key;

        // Generate a hash code from the user password
        // TODO: Should improve hashing with username but would prevent changing password.
        let crypto = require('crypto');
        let hash = crypto.createHash('sha256');
        let code = hash.update("mysaltis42" + password);
        code = hash.digest('hex');

        console.log("Submitted Hash is :", code);
        const users = await this.myDB.queryDB(
            {
                table: 'users',
                where: `username = '${username}'`
            }
        )
        // Validate 
        console.log(clef, users.length)
        if (users.length === 0 && clef === "cal41202") {
            await this.myDB.insertDB('users', [
                {
                    'hash': code,
                    'email': email,
                    'username': username,
                    'id': new Date().getTime()
                }
            ])
            /*
            _live_tokens[code2] = {
                username: username,
                'expiration': new Date().getTime() + (36000 * 4 * 60)
                //'expiration': new Date().getTime()+(60000) // Une minute
            };
            */
            this.send_success(this.res, "Créer");
        } else {
            throw ({ error: 401, msg: "Utilisateur ou clef de création invalide." });
        }

    }
}

export const myapiservice = (req, res) => {
    const myService = new MyAPI(req, res, "POST");
    myService.perform_execute();
}
