const Enum = require("../config/Enum");
const CustomError = require("./Error");
/* {consturctor }: Bu fonksiyon, bir sınıfın (class) yeni bir
 örneği oluşturulduğunda otomatik olarak çağrılır.Sınıfın özelliklerini 
 başlatmak veya başlangıç ayarlarını yapmak için kullanılır.*/
class Response {
 constructor() { }// tanımlamasakta olurdu
 
 static successResponse(data,code=200)// successResponse ozel bir kod belirtilmediyse 200 kodunu doner
 {
   return  {
             code,
             data
           }
 }

    static errorResponse(error) {
      console.error(error); // hatayı console da gösterir
        if( error instanceof CustomError){
          return  {
            code: error.code,
            error: {
              message:error.message,
              description:error.description
            }
          }
        }

      return  {
              code:Enum.HTTP_CODES.INT_SERVER_ERROR,
              error: {
                message:"Unknown error", 
                description:error.message

                    }
            }
      }
}// static kullanmasının sebebi module.exports = new Response; kullanmasıdır yani new Response yapmamıza gerek kalmaz
module.exports = Response;