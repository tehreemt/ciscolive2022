/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { BotkitConversation } = require('botkit');

const fetch = require("node-fetch"); 

const sdk = require('api')('@nightfall-dev-docs/v3.0.0#1cl4r3wl1mc4wib');


module.exports = function(controller) {

    const NEW_ROOM_DIALOG = 'new_room_dialog';
    const dialog = new BotkitConversation(NEW_ROOM_DIALOG, controller);
    dialog.say('I created this room so we could continue our conversation in private...');
    dialog.ask('How does that sound?', async(response, convo, bot) => {

    }, {key: 'how_it_sounds'});
    dialog.say('Ah, {{vars.how_it_sounds}}, eh?');
    dialog.say('I guess that is that.')

    controller.addDialog(dialog);

    controller.hears('delete','message,direct_message', async(bot, message) => {

        let reply = await bot.reply(message,'This message will be deleted in a few seconds.');
        setTimeout(async () => {
            let res = await bot.deleteMessage(reply);
        }, 5000);

    });


    controller.hears('create a room','message,direct_message', async(bot, message) => {

        // create a room
        let room = await bot.api.rooms.create({title: 'Cisco Live 2022 room'});

        // add user as member (bot is automatically added)
        let membership2 = await bot.api.memberships.create({
            roomId: room.id,
            personId: message.user,
        });

        await bot.startConversationInRoom(room.id, message.user);
        await bot.beginDialog(NEW_ROOM_DIALOG);

    });
    
    controller.hears('Tell me a joke','message,direct_message', async(bot, message) => {
	    let r;
	let response= await fetch("https://icanhazdadjoke.com/", {
        headers: {
            "Accept": "application/json"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
		r= data.joke;
		//console.log(data.joke);
        })
	await bot.reply(message, r);
        
    });
	
controller.hears('Credit card','message,direct_message', async(bot, message) => {
	  
	let p = `${ message.text }`;
	const options = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
	     Authorization: $NIGHTFALL_API_KEY
  },
  body: JSON.stringify({
    policyUUIDs: ['9df78ac7-e038-4c55-a2d8-e3e4a4bb454e'],
    payload: [p]
//config: {defaultRedactionConfig: {removeFinding: true}}
  })
};
	

fetch('https://api.nightfall.ai/v3/scan', options)
//  .then(response => response.json())
	.then(function(response) {
  return response.json();
	
})	
    });


	
    controller.on('memberships.created', async(bot, message) => {
        console.log('memberships created', message);
    });

//

}
