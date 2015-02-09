(function(MaModel) {

    MaModel.Task = {
        tableName: "Tasks",
        model: {
            Id: {
                type: "int",
                key: true,
                computed: true
            },
            Details: {
                type: String,
                required: true,
                maxLength: 200
            },
            DeadLine: {
                type: "datetime"
            },
            CompletedDateTime:{
                type: "datetime"
            },
            User__Id:{
                type:"int"
            },
            User: {
                type: "User",
                inverseProperty: "Tasks"
            }
        }
    }

})(window.MaModel = window.MaModel || {});