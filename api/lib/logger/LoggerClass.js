/* NEDEN  logger classını import edip  logger.error() şeklinde kullanmıyoruz?
   çünkü logları basarken bazen bazı degerleri maskelemek lazım olabilir kişisel b
    ilgileri loglamamak için mesela email adresi gibi. Bu yüzden ara bir class oluşturup kullanıyoruz
*/
const logger = require("./logger");
let instance = null;
class LoggerClass {
    constructor() {
        if (!instance) {       // burada class singelton olarak tasarlandı. Eğer instance null ise instance'ı oluşturur ve döndürür.
            instance = this;   // SİNGELTON TASARIM DESENİ: Bir sınıfın yalnızca bir örneğine sahip olmasını sağlar ve bu örneğe global erişim sağlar.
        }

        return instance;
    }
    
    #createLogObject(email, location, proc_type, log) {    
        return {
            email, location, proc_type, log            /*Parametreler: email, location, proc_type, ve log bilgilerini alır.
                                                       Dönüş Değeri: Bu bilgileri içeren bir nesne oluşturur ve döndürür. */
        }
    }

    info(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);// createLogObject fonksiyonu ile email, location, proc_type ve log bilgilerini kullanarak bir log nesnesi oluşturuyoruz.
        logger.info(logs);    //winstonun bize sundugu 'info' seviyesinde logluyoruz.
    }

    warn(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.warn(logs);
    }

    error(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.error(logs);
    }

    verbose(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.verbose(logs);
    }

    silly(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.silly(logs);
    }

    http(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.http(logs);
    }

    debug(email, location, proc_type, log) {
        let logs = this.#createLogObject(email, location, proc_type, log);
        logger.debug(logs);
    }
}

module.exports = new LoggerClass();