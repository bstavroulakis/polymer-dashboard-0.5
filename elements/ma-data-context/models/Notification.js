(function (MaModel) {

    MaModel.Notification = {
        tableName: "Notifications",
        model: {
            Id: {
                type: "int",
                key: true,
                computed: true
            },
            NotificationType__Id: {
                type: "int"
            },
            User__Id: {
                type: "int"
            },
            Item_Id: {
                type: "int"
            },
            Metadata:{
                type:"string"
            },
            ReadDate: {
                type: "datetime"
            }
            /*,
            User:{
                type:"User",
                inverseProperty:"Notifications"
            }
            ,
            NotificationType: {
                type: "NotificationType",
                inverseProperty: "Notifications"
            }*/
        }
    }

})(window.MaModel = window.MaModel || {});