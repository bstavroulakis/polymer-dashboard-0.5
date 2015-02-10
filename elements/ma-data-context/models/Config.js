
(function(MaModel) {

    MaModel.Config = {
        tableName: "Configs",
        model: {
            ConfigKey: {
                type: String,
                required: true,
                key: true,
                maxLength: 50
            },
            ConfigValue: {
                type: String,
                required: true,
                maxLength: 1000
            }
        }
    }

})(window.MaModel = window.MaModel || {});