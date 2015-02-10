(function(MaModel) {

    var asdadasdsd = "private";

    MaModel.User = {
        tableName: "Users",
        model: {
            Id: {
                type: "int",
                key: true,
                computed: true
            },
            Email: {
                type: String,
                required: true,
                maxLength: 200,
                error: "Email is required"
            },
            Password: {
                type: String,
                required: true,
                maxLength: 50,
                error: "Password is required"
            },
            FirstName: {
                type: String,
                required: false,
                maxLength: 50,
                error: "Max length of first name is 50 characters"
            },
            LastName: {
                type: String,
                required: false,
                maxLength: 100,
                error: "Max length of last name is 100 characters"
            },
            Address: {
                type: String,
                maxLength: 200
            },
            StateRegion: {
                type: String,
                maxLength: 50
            },
            Country: {
                type: String,
                maxLength: 50
            },
            ZipCode: {
                type: "int",
                maxLength: 6
            }
            /*,
            Tasks: {
                type: Array,
                elementType: "Task",
                inverseProperty: "User"
            },
            MailUsers:{
                type:"Array",
                elementType:"MailUser",
                inverseProperty:"User"
            },
            Notifications:{
                type:"Array",
                elementType:"Notification",
                inverseProperty:"User"
            }*/
        }
    };

})(window.MaModel = window.MaModel || {});
