(function(MaModel) {

    MaModel.NotificationType = {
        tableName: "NotificationTypes",
        model: {
            Id: {
                type: "int",
                key: true,
                computed: true
            },
            Title: {
                type: String,
                required: true,
                maxLength: 70
            },
            Notifications: {
                type: Array,
                elementType: "Notification",
                inverseProperty: "NotificationType"
            }
        }
    }

})(window.MaModel = window.MaModel || {});