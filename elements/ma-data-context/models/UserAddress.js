(function(MaModel) {

    MaModel.UserAddress = {
        tableName: "UserAddresses",
        model: {
            Id: {
                type: "int",
                key: true,
                computed: true
            },
            Address: {
                type: String,
                required: true,
                maxLength: 200,
                error: "Address is Required"
            },
            StateRegion: {
                type: String,
                required: true,
                maxLength: 50,
                error: "State/Region is required"
            },
            Country: {
                type: String,
                required: true,
                maxLength: 50,
                error: "Country is required"
            },
            ZipCode: {
                type: "int",
                required: true,
                maxLength: 6
            },
            Users: {
                type: Array,
                elementType: 'User',
                inverseProperty: 'UserAddress'
            }
        }
    };

})(window.MaModel = window.MaModel || {});
