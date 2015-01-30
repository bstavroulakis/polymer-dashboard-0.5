(function(MaModel) {

    MaModel.Page = {
        tableName: "Pages",
        model: {
            Id: {
                type: "int",
                key: true,
                computed: true
            },
            Icon: {
                type: String,
                required: true,
                maxLength: 200
            },
            Label: {
                type: String,
                required: true,
                maxLength: 50
            },
            Link:{
                type: String,
                required:false,
                maxLength: 150
            },
            Url:{
                type: String,
                required:false,
                maxLength: 150
            }
        }
    }

})(window.MaModel = window.MaModel || {});