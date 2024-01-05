import { SimpleBaseService } from "./common/baseserver";

// IMPORTANT : IF YOU NEED TO MODIFY baseserver.ts or bigquery.ts you MUST TEST OTHER SERVICE AND ALIGN ALL OF THEM

class MyAPI extends SimpleBaseService {
     // Effectue la request, typiquement la seule place a modifier.
     async execute() {
        // Just for testing will not be use
        console.log("Checking for token");
        console.log("Current : ", this.req.headers.authorization);

        const userId = await this.checkToken(this.req.headers.authorization);

        console.log("Got token for user : ", userId);

        if (userId !== undefined && userId !== '') {
            this.send_success(this.res, { 
                "valid": true, 
                'owner': userId,
                "message": `Bonjour ${userId} 42 est la reponse a tout!` 
            });
        } else {
            throw ({ error: 401, msg: "Le Token fournit est invalide ou expire" });
        }
     }
}

export const myapiservice = (req, res) => {
    const myService = new MyAPI(req, res);
    myService.perform_execute();
}
