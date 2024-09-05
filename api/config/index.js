//module.exports  bu dosya import edilebilir demek 
module.exports = {  
    "PORT": process.env.PORT || "3000",
    "LOG LEVEL": process.env.LOG_LEVEL || "debug",//LOG LEVEL değişkeni yoksa debug olacak
"CONNECTION_STRING": process.env.CONNECTION_STRING || "mongodb://localhost:27017/ProjectBase",//CONNECTION_STRING değişkeni yoksa mongodb://localhost:27017 olacak


}

