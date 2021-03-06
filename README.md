This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Application details
This project deals with the listing of rules in the format of cards and click on each card takes the user to the respective details of the rule.
The fields, items and operations are used from the default json data available in the models folder.
On details screen, click of save button validates the provided user values.

Three Routes
1) rules --- Listing all the rules
2) rule/new --- For creating the new rule
3) rule/:id --- For showing the details of rule

### Package Details
1) React   --- For building the UI

2) React-router-dom --- For routing between list and details screen

3) Axios --- For API calls

4) SCSS --- For styling the application

### APIs

Mock APIs is hosted on "https://my-json-server.typicode.com/tramachandran/rule-editor"
and the sample data is available in db.json file....
Get call works fine,
Whereas Post, Put, Delete works fine but they really don't update the db.json file.
"Message from my-json-server team (the resource will not be really updated on the server but it will be faked as if)". So the changes are not persisted.

### Db.json
The file db.json contains the default rules set which is used for rendering rule cards  and each data represents the various forms of rule with different conditions.
The put and post call for creating and updating the rule will console log the data structure of the rule gets created.... For sample data structure for rule please refer to db.json file
"Delete" rule is not implemented on rules list screen.

### Default Data sets
Fields, Operations and Items are currently used from files inside model folder, later this data can be moved to server and fetched using useEffect method....

###  To run the Application

Run `npm install` to install all required node packages required to run the application
then
Run `npm start` to start the application locally....

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### Screenshots
Application's desktop screen view and
mobile screen view is available inside screenshots folder
