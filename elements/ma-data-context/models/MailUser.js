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
                required:true,
                inverseProperty:"MailUsers"
            },
            User:{
                type:"User",
                required:true,
                inverseProperty:"MailUsers"
            },
            Mail__Id: { type: 'int' },
            User__Id: { type: 'int' }
        }
    }

})(window.MaModel = window.MaModel || {});