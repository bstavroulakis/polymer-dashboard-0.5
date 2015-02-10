/*! polymerdashboard 2015-02-11 */
!function(a){a.Config={tableName:"Configs",model:{ConfigKey:{type:String,required:!0,key:!0,maxLength:50},ConfigValue:{type:String,required:!0,maxLength:1e3}}}}(window.MaModel=window.MaModel||{}),function(a){a.Mail={tableName:"Mails",model:{Id:{type:"int",key:!0,computed:!0},Title:{type:String,required:!0,maxLength:100},Message:{type:String,required:!0,maxLength:300},SentDate:{type:"datetime"}}}}(window.MaModel=window.MaModel||{}),function(a){a.Page={tableName:"Pages",model:{Id:{type:"int",key:!0,computed:!0},Icon:{type:String,required:!0,maxLength:200},Label:{type:String,required:!0,maxLength:50},Link:{type:String,required:!1,maxLength:150},Url:{type:String,required:!1,maxLength:150}}}}(window.MaModel=window.MaModel||{}),function(a){a.User={tableName:"Users",model:{Id:{type:"int",key:!0,computed:!0},Email:{type:String,required:!0,maxLength:200,error:"Email is required"},Password:{type:String,required:!0,maxLength:50,error:"Password is required"},FirstName:{type:String,required:!1,maxLength:50,error:"Max length of first name is 50 characters"},LastName:{type:String,required:!1,maxLength:100,error:"Max length of last name is 100 characters"},Address:{type:String,maxLength:200},StateRegion:{type:String,maxLength:50},Country:{type:String,maxLength:50},ZipCode:{type:"int",maxLength:6}}}}(window.MaModel=window.MaModel||{}),function(a){a.Task={tableName:"Tasks",model:{Id:{type:"int",key:!0,computed:!0},Details:{type:String,required:!0,maxLength:200},DeadLine:{type:"datetime"},CompletedDateTime:{type:"datetime"},User__Id:{type:"int"}}}}(window.MaModel=window.MaModel||{}),function(a){a.MailUser={tableName:"MailUsers",model:{Id:{type:"int",key:!0,computed:!0},Mail__Id:{type:"int"},User__Id:{type:"int"},Sender__Id:{type:"int"}}}}(window.MaModel=window.MaModel||{}),function(a){a.Notification={tableName:"Notifications",model:{Id:{type:"int",key:!0,computed:!0},NotificationType__Id:{type:"int"},User__Id:{type:"int"},Item_Id:{type:"int"},Metadata:{type:"string"},ReadDate:{type:"datetime"}}}}(window.MaModel=window.MaModel||{}),function(a){a.NotificationType={tableName:"NotificationTypes",model:{Id:{type:"int",key:!0,computed:!0},Title:{type:String,required:!0,maxLength:70}}}}(window.MaModel=window.MaModel||{}),function(a){a.Config=[{ConfigKey:"DashboardSettings",ConfigValue:"{right:false, width:'200px'}"},{ConfigKey:"MainUrl",ConfigValue:"http://localhost:63342/polymer-dashboard/"}]}(window.MaSeedData=window.MaSeedData||{}),function(a){a.Mail=[{Title:"Fusce posuere felis sed lacus.",Message:"Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",SentDate:",11/4/2014 7:55"},{Title:"Morbi vel lectus in quam fringilla rhoncus.",Message:"Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",SentDate:",4/23/2014 0:22"},{Title:"Nam tristique tortor eu pede.",Message:"Sed ante. Vivamus tortor. Duis mattis egestas metus.",SentDate:",10/25/2014 9:50"},{Title:"Integer ac leo.",Message:"Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",SentDate:",8/20/2014 6:05"},{Title:"Integer ac neque.",Message:"Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.",SentDate:",2/21/2014 8:34"},{Title:"Nullam molestie nibh in lectus.",Message:"Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",SentDate:",2/5/2014 20:02"},{Title:"Praesent id massa id nisl venenatis lacinia.",Message:"In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",SentDate:",9/30/2014 11:22"},{Title:"Morbi quis tortor id nulla ultrices aliquet.",Message:"Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",SentDate:",5/7/2014 20:34"},{Title:"Duis ac nibh.",Message:"In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",SentDate:",5/26/2014 18:41"},{Title:"Praesent blandit.",Message:"Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",SentDate:",12/3/2014 14:21"},{Title:"Etiam justo.",Message:"Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",SentDate:",2/26/2014 19:05"},{Title:"Vivamus in felis eu sapien cursus vestibulum.",Message:"Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.",SentDate:",12/2/2014 19:50"},{Title:"Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",Message:"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",SentDate:",8/16/2014 6:43"},{Title:"Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",Message:",Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.",SentDate:",9/8/2014 18:52"},{Title:"Proin eu mi.",Message:"Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.",SentDate:",9/11/2014 16:26"},{Title:"Praesent blandit.",Message:"Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.",SentDate:",5/23/2014 12:49"},{Title:"Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",Message:",Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",SentDate:",1/11/2015 21:57"},{Title:"Fusce consequat",Message:"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",SentDate:",7/18/2014 11:10"},{Title:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit",Message:",Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.",SentDate:",6/7/2014 20:08"},{Title:"Suspendisse potenti.",Message:"Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",SentDate:",7/4/2014 12:53"},{Title:"Nam dui.",Message:"Sed ante. Vivamus tortor. Duis mattis egestas metus.",SentDate:",12/12/2014 4:02"},{Title:"Duis bibendum, felis sed interdum venenatis.",Message:"In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.",SentDate:",6/28/2014 10:58"},{Title:"Nam dui.",Message:"Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.",SentDate:",10/17/2014 17:40"},{Title:"Morbi quis tortor id nulla ultrices aliquet.",Message:"Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",SentDate:",12/25/2014 6:16"},{Title:"Nullam sit amet turpis elementum ligula vehicula consequat.",Message:"Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",SentDate:",7/12/2014 7:52"},{Title:"Vestibulum rutrum rutrum neque.",Message:"Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.",SentDate:",3/13/2014 11:32"},{Title:"Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo.",Message:",Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",SentDate:",8/18/2014 7:10"},{Title:"Aliquam sit amet diam in magna bibendum imperdiet.",Message:"Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",SentDate:",8/13/2014 20:51"},{Title:"Aliquam erat volutpat.",Message:"Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",SentDate:",7/19/2014 14:24"},{Title:"Nullam varius.",Message:"Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.",SentDate:",6/22/2014 12:17"},{Title:"Phasellus sit amet erat.",Message:"Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",SentDate:",10/18/2014 22:00"},{Title:"Integer aliquet, massa id lobortis convallis.",Message:"Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.",SentDate:",6/8/2014 13:29"},{Title:"Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo.",Message:"Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",SentDate:",12/1/2014 10:59"},{Title:"Nam dui.",Message:"Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",SentDate:",4/11/2014 4:40"},{Title:"Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",Message:"Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",SentDate:",1/6/2015 16:29"},{Title:"Proin eu mi.",Message:"Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",SentDate:",2/22/2014 0:05"},{Title:"Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",Message:"Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",SentDate:",5/8/2014 13:28"},{Title:"Vestibulum ac est lacinia nisi venenatis tristique.",Message:"Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",SentDate:",9/20/2014 3:36"},{Title:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",Message:"Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",SentDate:",11/1/2014 1:50"},{Title:"Curabitur gravida nisi at nibh.",Message:"Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",SentDate:",12/14/2014 11:34"},{Title:"Integer non velit.",Message:"Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",SentDate:",8/17/2014 5:56"},{Title:"Vivamus vel nulla eget eros elementum pellentesque.",Message:"Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",SentDate:",10/11/2014 14:11"},{Title:"Sed vel enim sit amet nunc viverra dapibus.",Message:"Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",SentDate:",6/4/2014 19:07"},{Title:"Maecenas tincidunt lacus at velit.",Message:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.",SentDate:",5/8/2014 2:54"},{Title:"Mauris sit amet eros.",Message:"Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",SentDate:",9/28/2014 13:34"},{Title:"Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo.",Message:"Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",SentDate:",12/11/2014 6:27"},{Title:"Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",Message:"Sed ante. Vivamus tortor. Duis mattis egestas metus.",SentDate:",12/17/2014 2:57"},{Title:"In est risus, auctor sed, tristique in, tempus sit amet, sem.",Message:"Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",SentDate:",11/14/2014 19:30"},{Title:"Donec semper sapien a libero.",Message:"Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",SentDate:",1/30/2015 2:20"}]}(window.MaSeedData=window.MaSeedData||{}),function(a){a.Page=[{Icon:"home",Label:"Home",Link:"home",Url:"/pages/home/home.html"},{Icon:"social:person",Label:"My Profile",Link:"my-profile",Url:"/pages/my-profile/my-profile.html"},{Icon:"assignment",Label:"Tasks",Link:"tasks",Url:"/pages/tasks/tasks.html"},{Icon:"mail",Label:"Mails",Link:"mails",Url:"/pages/mails/mails.html"}]}(window.MaSeedData=window.MaSeedData||{}),function(a){a.User=[{FirstName:"Bill",LastName:"Stavroulakis",Email:"bstavroulakis@gmail.com",Password:"1234",Address:"Address 1",StateRegion:"Attiki",Country:"Greece",ZipCode:"123456"},{FirstName:"Testy",LastName:"Tester",Email:"test@test.com",Password:"test"}]}(window.MaSeedData=window.MaSeedData||{}),function(a){a.Task=[{Details:"Call Julie for meeting",CompletedDateTime:null,DeadLine:new Date(Date.parse("January 19, 2015 19:00:00")),User__Id:1},{Details:"Finish Polymer Dashboard Tasks",CompletedDateTime:null,DeadLine:new Date(Date.parse("January 19, 2015 17:00:00")),User__Id:2},{Details:"Go for groceries",CompletedDateTime:new Date(Date.parse("January 19, 2015 13:00:00")),DeadLine:new Date(Date.parse("January 19, 2015 15:00:00")),User__Id:1},{Details:"Visit dentist for regular checkup",DeadLine:new Date(Date.parse("January 20, 2015 19:00:00")),User__Id:1},{Details:"Get parents from the airport",CompletedDateTime:new Date(Date.parse("January 18, 2015 11:00:00")),DeadLine:new Date(Date.parse("January 18, 2015 11:00:00")),User__Id:2},{Details:"Meeting with John for project A",CompletedDateTime:null,DeadLine:new Date(Date.parse("January 20, 2015 11:00:00")),User__Id:1},{Details:"Date with Sussanne",CompletedDateTime:null,DeadLine:new Date(Date.parse("January 21, 2015 21:00:00")),User__Id:1},{Details:"Meeting with Jennifer for project B",CompletedDateTime:null,DeadLine:new Date(Date.parse("January 22, 2015 11:00:00")),User__Id:1},{Details:"Volley Ball practice",CompletedDateTime:null,DeadLine:new Date(Date.parse("January 23, 2015 19:00:00")),User__Id:1},{Details:"Fix Garage Door",CompletedDateTime:null,DeadLine:new Date(Date.parse("January 24, 2015 11:00:00")),User__Id:2},{Details:"Coffee with Chris",CompletedDateTime:null,DeadLine:new Date(Date.parse("January 24, 2015 13:00:00")),User__Id:1}]}(window.MaSeedData=window.MaSeedData||{}),function(a){a.MailUser=[{Mail__Id:1,User__Id:2,Sender__Id:2},{Mail__Id:2,User__Id:2,Sender__Id:1},{Mail__Id:3,User__Id:2,Sender__Id:2},{Mail__Id:4,User__Id:2,Sender__Id:2},{Mail__Id:5,User__Id:2,Sender__Id:1},{Mail__Id:6,User__Id:2,Sender__Id:1},{Mail__Id:7,User__Id:2,Sender__Id:2},{Mail__Id:8,User__Id:2,Sender__Id:2},{Mail__Id:9,User__Id:2,Sender__Id:2},{Mail__Id:10,User__Id:2,Sender__Id:2},{Mail__Id:11,User__Id:2,Sender__Id:1},{Mail__Id:12,User__Id:2,Sender__Id:2},{Mail__Id:13,User__Id:2,Sender__Id:2},{Mail__Id:14,User__Id:2,Sender__Id:1},{Mail__Id:15,User__Id:2,Sender__Id:1},{Mail__Id:16,User__Id:2,Sender__Id:2},{Mail__Id:17,User__Id:2,Sender__Id:2},{Mail__Id:18,User__Id:2,Sender__Id:2},{Mail__Id:19,User__Id:2,Sender__Id:2},{Mail__Id:1,User__Id:1,Sender__Id:2},{Mail__Id:2,User__Id:1,Sender__Id:1},{Mail__Id:3,User__Id:1,Sender__Id:2},{Mail__Id:4,User__Id:1,Sender__Id:2},{Mail__Id:5,User__Id:1,Sender__Id:1},{Mail__Id:6,User__Id:1,Sender__Id:1},{Mail__Id:7,User__Id:1,Sender__Id:2},{Mail__Id:8,User__Id:1,Sender__Id:2},{Mail__Id:9,User__Id:1,Sender__Id:2},{Mail__Id:10,User__Id:1,Sender__Id:2},{Mail__Id:11,User__Id:1,Sender__Id:1},{Mail__Id:12,User__Id:1,Sender__Id:2},{Mail__Id:13,User__Id:1,Sender__Id:2},{Mail__Id:14,User__Id:1,Sender__Id:1},{Mail__Id:15,User__Id:1,Sender__Id:1},{Mail__Id:16,User__Id:1,Sender__Id:2},{Mail__Id:17,User__Id:1,Sender__Id:2},{Mail__Id:18,User__Id:1,Sender__Id:2},{Mail__Id:19,User__Id:1,Sender__Id:2}]}(window.MaSeedData=window.MaSeedData||{}),function(a){a.Notification=[]}(window.MaSeedData=window.MaSeedData||{}),function(a){a.NotificationType=[{Id:1,Title:"Mail"},{Id:2,Title:"Task"}]}(window.MaSeedData=window.MaSeedData||{});