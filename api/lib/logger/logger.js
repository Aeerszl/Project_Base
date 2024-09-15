// Winston'dan format, createLogger ve transports modüllerini alıyoruz.
// format: Logların formatını düzenlememizi sağlar.
// createLogger: Logları oluşturmak için kullanılan temel fonksiyondur.
// transports: Logları nereye ve nasıl yazacağımızı belirleyen yapı taşlarıdır.
const { format, createLogger, transports } = require("winston");
const { LOG_LEVEL } = require("../../config");// LOG_LEVEL değeri, config dosyasından çekiliyor.

const formats = format.combine(// Log formatı tanımlanıyor. Logların zaman damgası, formatı ve log mesajlarının
                              // nasıl görüneceğini belirlemek için kullanılıyor.
    
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }), // Zaman damgası formatı belirleniyor (YYYY-AA-GG SS:dd:ss.SSS)
    format.simple(),    // Logların basit bir şekilde gösterilmesini sağlar.
    format.splat(),    // %s gibi yer tutucuların log içinde kullanılabilmesi için splat formatı.
    format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: [email:${info.message.email}] [location:${info.message.location}] [procType:${info.message.proc_type}] [log:${info.message.log}]`)
    // Logların nasıl görüneceğini belirleyen printf fonksiyonu.
    // info.timestamp: logun zamanını alır.
    // info.level.toUpperCase log seviyesini (info, error vs.) büyük harfle alır.
    // info.message: log mesajındaki bilgileri alır.
)

// 2023-05-04 12:12:12 INFO: [email:asd] [location:asd] [procType:asd] [log:{}]

const logger = createLogger({// Logger oluşturuluyor.tanımlanıyor.
                             // Winston, log seviyesini (LOG_LEVEL) ve logların nereye (transports) yazılacağını tanımlar.
    level: LOG_LEVEL,    // projenin yapılandırma dosyasında belirtilen log seviyesini içerir..

    transports: [// Logları konsola yazmak için transport belirleniyor.

        new (transports.Console)({ format: formats })  // Konsol üzerine yazılacak logların formatı belirleniyor.

    ]
});

module.exports = logger;

/* level: LOG_LEVEL,  mesela  LOG_LEVEL=info  olarak tanımlanmışsa info ve üzeri seviyeleri loglanır yani error warn ve info loglanır
error:0
warn:1
info:2
http:3
verbose:4
debug:5
silly:6


    
*/