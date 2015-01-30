

(function(MaModel) {

    var asdadasdsd = "private";

    MaModel.Mail = {
        tableName: "Mails",
        model: {
            Id: {
                type: "int",
                key: true,
                computed: true
            },
            Email: {
                type: String,
                required: true,
                maxLength: 200
            },
            Password: {
                type: String,
                required: true,
                maxLength: 50
            }
        }
    }

})(window.MaModel = window.MaModel || {});