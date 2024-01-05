import { SimpleBaseService } from "./common/baseserver";

// IMPORTANT : IF YOU NEED TO MODIFY baseserver.ts or bigquery.ts you MUST TEST OTHER SERVICE AND ALIGN ALL OF THEM

class MyAPI extends SimpleBaseService {
     // Effectue la request, typiquement la seule place a modifier.
     async execute() {
         console.log("Replace Code");
 
         // TODO Add Page and skip parameters
         const data = "Hello from the base";
 
         this.send_success(this.res, data || data[0]);
     }
}

export const myapiservice = (req, res) => {
    const myService = new MyAPI(req, res);
    myService.perform_execute();
}
