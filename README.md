# Polymer Dashboard using Material Design

If you want to go over the “Web Components” post series you can start here => http://bstavroulakis.com/blog/web/web-components-html-templates/

I’m very happy to be in the process of putting together a new Pluralsight course with the title “An end to end application using Polymer and Material Design”. In this course we’ll create a Web Application with Polymer.js using the Material Design principles. It will also have a front-end database using jaydata.js. If you’re new to Material Design you can check it out here =>  http://www.google.com/design/

To cover Polymer.js we’ll construct a Polymer Dashboard which will have:

![alt tag](http://bstavroulakis.com/blog/wp-content/uploads/2015/02/materialAdmin.jpg)

- A Login and Register Page
- A Homepage with various blocks
- A Tasks page
- A Mails page
- Some real-time functionality so if you open the site in two tabs and update a task or mail it will automatically load on the other tab as well.
- The project is using a front-end database (IndexedDb or WebSQL depending the system). But it can easily use a back-end RESTful service as well since each call passes through the repo files => https://github.com/bstavroulakis/polymer-dashboard/tree/master/elements/ma-repos. So you can plugin any back-end you wish in the future instead of using the front-end database/logic.
- Testing (under construction)

# Demo

If you want to checkout the Demo of the “Polymer Dashboard” you can visit this site => http://bstavroulakis.com/demos/polymer-dashboard/pages/auth/auth.html

- Username: bstavroulakis@gmail.com
- Password: 1234

Or you can checkout the project’s github page => https://github.com/bstavroulakis/polymer-dashboard and Developer version (non-vulcanized) at the following links

- http://bstavroulakis.com/demos/polymer-dashboard/pages/auth/auth-dev.html
- http://bstavroulakis.com/demos/polymer-dashboard/dev.html

I would love some feedback/fixes/considerations on the approach and who knows it may grow in the future if it gains the right momentum.
