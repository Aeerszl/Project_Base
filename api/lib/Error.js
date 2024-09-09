class CustomError extends Error {
    constructor(code, message, description) {
        super(`{"code": "${code}", "message": "${message}", "description":"${description}"}`);
        this.code = code;
        this.message = message;
        this.description = description;
    }
}

module.exports = CustomError;

/* NOTLAR ✍️:
1-class CustomError extends Error ile, JavaScript'in yerleşik Error sınıfından türeyen bir sınıf yaratıyoruz.
  Bu, Error sınıfının tüm özelliklerini alır ve üzerinde değişiklik yapabiliriz.
2-constructor(code, message, description) ifadesi, CustomError sınıfına bir nesne oluşturulurken parametre
   olarak code, message ve description almasını sağlar.
3-super(...) ifadesi, üst sınıf olan Error'ın yapıcı fonksiyonunu çağırır. Burada, hata mesajını JSON 
  formatında string haline getirip üst sınıfa veriyoruz. Bu sayede, hata çıktısı, code, message ve description
  değerlerini içeren bir JSON stringi olarak görünür.
4-this.code = code; ile sınıfın code özelliği oluşturuluyor ve constructor'dan gelen code değeri bu özelliğe
  atanıyor.Aynı şekilde message ve description özellikleri de sınıfa atanıyor
5-module.exports = CustomError; ifadesi, bu sınıfın diğer dosyalarda kullanılabilmesi için dışa aktarılmasını sağlar.

👇🏼 " $ " KULLANMASININ SEBEBİ 👇🏼
${code}, code değişkeninin değerini alır ve stringin içine yerleştirir.
${message}, message değişkeninin değerini string içinde aynı şekilde yerleştirir.
${description}, description değişkenini string içinde kullanır.

*/