import yargs from 'yargs';
import fs from 'fs'
import { hideBin } from 'yargs/helpers';
import { type } from 'os';

const lookForGitActivity = async (username) =>{

    const respons = await fetch(`https://api.github.com/users/${username}/events`); // fetch makes an http request and returns promise that resolves to response object
    if(!respons.ok){
        if(respons.status==404){
            console.log("No such user found please check the username again")
        }
        else{
            console.log(`error fetching data ${respons.status}`);
        }
        return null;
    }
    const data = await respons.json();
    return data;
}

const display = (events) =>{
    if (!events) return;
    if(events.length==0){
        console.log('user has no activity yet');
        return;
    }
    events.forEach((event , index) => {
        if(event.type=='CreateEvent'){
            console.log(`<------------------------- event ${index+1} ---------------------->`);
            console.log(`Created ${event.payload.ref_type} in ${event.repo.name}`);
            console.log(`created at : ${event.created_at}`);
        }
        else if(event.type=='PushEvent'){
             const commitCount = event.payload.commits?.length ?? 0;;
             console.log(`<------------------------- event ${index+1} ---------------------->`);
             console.log(`Pushed ${commitCount} commit(s) to ${event.repo.name}`);
             console.log(`pushed on ${event.created_at}`);
        }
        else if(event.type=='IssuesEvent'){
            console.log(`<------------------------- event ${index+1} ---------------------->`);
            console.log( `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} an issue in ${event.repo.name}`);
            console.log(`dated at ${event.created_at}`);
        }
        else if(event.type=='WatchEvent'){
            console.log(`<------------------------- event ${index+1} ---------------------->`);
            console.log(`Starred ${event.repo.name}`);
            console.log(`starred at ${event.created_at}`);
        }
        else if(event.type=='ForkEvent'){
            console.log(`<------------------------- event ${index+1} ---------------------->`);
            console.log( `Forked ${event.repo.name}`);
            console.log(`forked at ${event.created_at}`);
        }
    });
}

yargs(hideBin(process.argv))
    .command({
        command: 'look',
        describe: 'look for the usernames github history',
        builder: {
            username:{
                describe:'github username',
                demandOption: true,
                type: 'string'
            }
            
        },
        handler(argv){
            lookForGitActivity(argv.username).then((events=>display(events))); // using then ensures that request is made and promise if converted to the response onject
        }
    })
    .parse()