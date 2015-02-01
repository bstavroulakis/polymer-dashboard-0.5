(function(MaSeedData) {

    MaSeedData.User = [{
        FirstName: 'Bill',
        LastName: 'Stavroulakis',
        Email: "bstavroulakis@gmail.com",
        Password: "1234",
        UserAddress: {
            "Address": "Address 1",
            "StateRegion": "Attiki",
            "Country": "Greece",
            "ZipCode": "123456"
        },
        MailUsers:[{
          Mail:{Title:"Donec semper sapien a libero.",Message:"Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",SentDate:",1/30/2015 2:20"}
        }],
        Tasks: [{
            Details: "Call Julie for meeting",
            CompletedDateTime: null,
            DeadLine: new Date(Date.parse("January 19, 2015 19:00:00"))
        }, {
            Details: "Finish Polymer Dashboard Tasks",
            CompletedDateTime: null,
            DeadLine: new Date(Date.parse("January 19, 2015 17:00:00"))
        }, {
            Details: "Go for groceries",
            CompletedDateTime: new Date(Date.parse("January 19, 2015 13:00:00")),
            DeadLine: new Date(Date.parse("January 19, 2015 15:00:00"))
        }, {
            Details: "Visit dentist for regular checkup",
            DeadLine: new Date(Date.parse("January 20, 2015 19:00:00"))
        }, {
            Details: "Get parents from the airport",
            CompletedDateTime: new Date(Date.parse("January 18, 2015 11:00:00")),
            DeadLine: new Date(Date.parse("January 18, 2015 11:00:00"))
        }, {
            Details: "Meeting with John for project A",
            CompletedDateTime: null,
            DeadLine: new Date(Date.parse("January 20, 2015 11:00:00"))
        }, {
            Details: "Date with Sussanne",
            CompletedDateTime: null,
            DeadLine: new Date(Date.parse("January 21, 2015 21:00:00"))
        }, {
            Details: "Meeting with Jennifer for project B",
            CompletedDateTime: null,
            DeadLine: new Date(Date.parse("January 22, 2015 11:00:00"))
        }, {
            Details: "Volley Ball practice",
            CompletedDateTime: null,
            DeadLine: new Date(Date.parse("January 23, 2015 19:00:00"))
        }, {
            Details: "Fix Garage Door",
            CompletedDateTime: null,
            DeadLine: new Date(Date.parse("January 24, 2015 11:00:00"))
        }, {
            Details: "Coffee with Chris",
            CompletedDateTime: null,
            DeadLine: new Date(Date.parse("January 24, 2015 13:00:00"))
        }]
    }, {
        FirstName: "Testy",
        LastName: "Tester",
        Email: "test@test.com",
        Password: "test"
    }];

})(window.MaSeedData = window.MaSeedData || {});