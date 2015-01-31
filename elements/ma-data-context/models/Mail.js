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
                maxLength: 200
            },
            Message: {
                type: String,
                required: true,
                maxLength: 50
            },
            SentDate:{
                type: "datetime"
            }
        }
    }

})(window.MaModel = window.MaModel || {});