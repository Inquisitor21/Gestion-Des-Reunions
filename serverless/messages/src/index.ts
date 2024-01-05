import { SimpleBaseService } from "./common/baseserver";

// IMPORTANT : IF YOU NEED TO MODIFY baseserver.ts or bigquery.ts you MUST TEST OTHER SERVICE AND ALIGN ALL OF THEM

class MyAPI extends SimpleBaseService {
     // Effectue la request, typiquement la seule place a modifier.
     async execute() {
         console.log("Replace Code");
 
         // TODO Add Page and skip parameters
         const data = "Hello from the base";
         let message = this.req.body.message;

         /*
         Ici je vais utiliser insertDBNoBuffer car le insert DB procède différemment et la requête est mise en attente
         await this.myDB.insertDB('messages', [
            {
                'message': message,
                'id': new Date().getTime()
            }
        ])
        */

        await this.myDB.insertDBNoBuffer(
            'messages', 
            [	
                // Attention à l'ordre des colonnes elle doit être identique à la table
                message,
                new Date()
            ]
        );
 
         this.send_success(this.res, data || data[0]);
     }
}

export const myapiservice = (req, res) => {
    const myService = new MyAPI(req, res, "POST,GET");
    myService.perform_execute();
}
