(function(MaModel) {

    MaModel.MailUser = {
        tableName: "MailUsers",
        model: {
            Id: {
                type: "int",
                key: true,
                computed: true
            },
            Mail:{
                type:"Mail",
                inverseProperty:"MailUsers"
            },
            User:{
                type:"User",
                inverseProperty:"MailUsers"
            }
        }
    }

})(window.MaModel = window.MaModel || {});