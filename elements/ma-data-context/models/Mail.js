(function(MaModel) {

    MaModel.Mail = {
        tableName: "Mails",
        model: {
            Id: {
                type: "int",
                key: true,
                computed: true
            },
            Title: {
                type: String,
                required: true,
                maxLength: 100,
                error:"Email Title is required. Max length 100 characters."
            },
            Message: {
                type: String,
                required: true,
                maxLength: 300,
                error:"Email Message is required. Max length 100 characters."
            },
            SentDate:{
                type: "datetime"
            }
        }
    }

})(window.MaModel = window.MaModel || {});