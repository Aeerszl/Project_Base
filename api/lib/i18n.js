const i18n = require("../i18n");
 // Çeviri dosyasını içeri alır. Bu dosyada dil ve anahtar değerlerine karşılık gelen metinler bulunur.

class I18n {

    constructor(lang) {
        // Kullanıcı tarafından seçilen dili sınıfın içine kaydeder. Varsayılan dil olarak geçerli olacaktır.
        this.lang = lang;
    }

    translate(text, lang = this.lang, params = []) {
        // 'text' bir anahtar olarak girilir, mesela "COMMON.VALIDATION_ERROR_TITLE".
        // 'lang', çevirinin yapılacağı dili belirtir. Eğer belirtilmezse, constructor'da verilen dil (this.lang) kullanılır.
        // 'params', metin içinde değiştirilecek yer tutucular için değerler içerir. Örneğin, "This field {} is required" içinde '{}' yer tutucusudur.

        let arr = text.split("."); 
        // Text anahtarını, her bir bölümü ayrı eleman olacak şekilde diziye böler.
        // Örneğin: "COMMON.VALIDATION_ERROR_TITLE" => ['COMMON', 'VALIDATION_ERROR_TITLE']

        let val = i18n[lang][arr[0]]; 
        // İlk parçaya göre çeviri dosyasından ilgili dildeki ilk bölüme gider.
        // Örneğin: i18n["EN"]["COMMON"]

        for (let i = 1; i < arr.length; i++) {
            val = val[arr[i]]; 
            // Dizi elemanlarını sırayla takip ederek çeviriyi bulur. 
            // Örneğin: i18n["EN"]["COMMON"]["VALIDATION_ERROR_TITLE"] => "Validation Error"
        }

        val = val + ""; 
        // Bulunan çeviriyi string'e çevirir (bu satır genelde gereksiz gibi görünse de, val null veya undefined ise hata çıkmasını önleyebilir).

        for (let i = 0; i < params.length; i++) {
            val = val.replace("{}", params[i]); 
            // Eğer çeviri metninde '{}' varsa, params dizisindeki elemanlarla sırayla değiştirir.
            // Örneğin: "This field {} is required" ve params = ["email"] ise => "This field email is required"
        }

        return val || ""; 
        // Eğer çeviri bulunamazsa (undefined veya null dönerse), boş string döner.
    }

}

module.exports = I18n; // Bu sınıfı dışa aktarır, böylece diğer dosyalarda kullanılabilir.
