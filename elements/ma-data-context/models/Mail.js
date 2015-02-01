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
                maxLength: 100
            },
            Message: {
                type: String,
                required: true,
                maxLength: 300
            },
            SentDate:{
                type: "datetime"
            },
            MailUsers:{
                type:"Array",
                elementType:"MailUser",
                inverseProperty:"Mail"
            }
        }
    }

})(window.MaModel = window.MaModel || {});