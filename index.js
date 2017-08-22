'use strict';

const express = require('express');
const bodyParser = require('body-parser');
// var requestapp = require('request');
let ApiAiApp = require('actions-on-google').ApiAiApp;

const BIRTHDAYS = 'Birthday_Intent';
const MILESTONES = 'Milestone_Intent';
const ANNIVERSARY = 'Anniversay_Intent';
const WELCOME = 'input.welcome';
const NO_INTENT = 'no_intent';


const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/mirror', function(request, response) {
    const app = new ApiAiApp({request,response});
    var requestapp = require('request');

    function getWelcome(app)
    {
        app.ask(app
            .buildRichResponse()

            .addSimpleResponse({speech: 'Welcome to Cantiz Mirror, you can find the Milestones, Birthdays, ' +
            'and wedding anniversarys for today. So,  which feeds you would like to hear ?', displayText: 'Welcome ' +
            'to Cantiz Mirror.'})
            .addSuggestions(['Birthdays', 'Milestones', 'Wedding Anniversary'])
            .addSuggestionLink('Cantiz Mirror', 'http://mirror.attinadsoftware.com/'));
    }

    function getBirthdays(app)
    {
        app.ask(app
            .buildRichResponse()

            .addSimpleResponse({speech: 'Welcome to Cantiz Mirror, you can find the Milestones, Birthdays, ' +
            'and wedding anniversarys for today. So,  which feeds you would like to hear ?', displayText: 'Welcome ' +
            'to Cantiz Mirror.'})
            .addSuggestions(['Birthdays', 'Milestones', 'Wedding Anniversary'])
            .addSuggestionLink('Cantiz Mirror', 'http://mirror.attinadsoftware.com/'));

    }

    function getMilestones(app)
    {
        requestapp.get({
                url: 'http://teamcantiz:megamirror156@stg.mirror.attinadsoftware.com:8080/milestones.json'
            },
            function (request, response, body){

                var resFinal = responseSerialization(body);
                if (resFinal!=null) {
                    var finalString ='';
                    for (var key in resFinal) {
                        finalString = finalString + ' People celebrating ' + key + ' year milestone ';
                        resFinal[key].forEach(function (value) {
                            finalString = finalString + value + ' ,';
                        });
                    }

                    console.log('res final ' + finalString);

                    app.ask(app
                        .buildRichResponse()
                        .addSimpleResponse({speech: finalString, displayText: finalString}));
                }
                else {
                    app.ask(app
                        .buildRichResponse()
                        .addSimpleResponse({
                            speech: 'There are no milestones for todays',
                            displayText: 'No Milestones'
                        }));
                }
            });
    }

    function getAnniversary(app)
    {
        app.ask(app
            .buildRichResponse()

            .addSimpleResponse({speech: 'Welcome to Cantiz Mirror, you can find the Milestones, Birthdays, ' +
            'and wedding anniversarys for today. So,  which feeds you would like to hear ?', displayText: 'Welcome ' +
            'to Cantiz Mirror.'})
            .addSuggestions(['Birthdays', 'Milestones', 'Wedding Anniversary'])
            .addSuggestionLink('Cantiz Mirror', 'http://mirror.attinadsoftware.com/'));
    }


    const actionMap = new Map();
    actionMap.set(WELCOME, getWelcome);
    actionMap.set(BIRTHDAYS, getBirthdays);
    actionMap.set(MILESTONES, getMilestones);
    actionMap.set(ANNIVERSARY, getAnniversary);


    app.handleRequest(actionMap);

});


restService.listen((process.env.PORT || 5000), function() {
    console.log("Server up and listening");
});

function responseSerialization(body) {
    var resFinal = {};
    var jsonBody = JSON.parse(body);
    if (Object.keys(jsonBody).length>0) 
    {
        for (var key in jsonBody) {
            if (jsonBody[key] != null) {
                var objArr = [];
                jsonBody[key].forEach(function (value) {
                    objArr.push(value.name);
                });
                resFinal[key] = objArr;
            }
        }
        return resFinal;
    }
    else {
        return null;
    }
}

function parseBirthdayResponse(body) {
    var resFinal = '';
    var responseArr = JSON.parse(body);
    if (Object.keys(responseArr).length === 0) {
    }
    else {
        for (var i = 0; i<responseArr.length; i++) {
            if (responseArr[i] != null) {
                resFinal = resFinal + responseArr[i].name + ', ';
            }
        }
    }
    return resFinal;
}
