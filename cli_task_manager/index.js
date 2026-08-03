import fs from 'fs';
import { type } from 'os';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const taskFile = 'tasks.json'; // it is the file where all the tasks are store

const readTasks = () => {
    try{
        const dataBuffer = fs.readFileSync(taskFile); // fs.readFileSync() function reads the data from the file and returns the data buffer object consisting of bytes
        const dataJSON = dataBuffer.toString(); // converting the raw bytes to the string
        return JSON.parse(dataJSON); // it converts the json formatted string to the normal string 
    }
    catch(err){
        return [];
    }
}

const writeTask = (tasks) =>{
    const dataJSON = JSON.stringify(tasks , null ,2); // strigify() function converts the normal string to json formatted string
    fs.writeFileSync(taskFile , dataJSON); // writes the json formatted string to the file
}


yargs(hideBin(process.argv))
    .command({
        command: 'add',
        describe: 'Add a new task',
        builder: {
            description: {
                describe: 'Task Description',
                demandOption: true,
                type: 'string'
            }
        },
        handler(argv) {
            const tasks = readTasks();
            const maxId = tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
            const newTask = {
                id: maxId + 1,
                description: argv.description,
                completed: false
            };
            tasks.push(newTask);
            writeTask(tasks);
            console.log(`Task "${argv.description}" added successfully!`);
        }
    })
    .command({
        command: 'list',
        describe: 'List all tasks',
        handler() {
            const tasks = readTasks();
            if (tasks.length === 0) {
                console.log("No tasks available.");
                return;
            }
            console.log('Tasks List:');
            tasks.forEach((task) => {
                console.log(`${task.id}. ${task.description} - ${task.completed ? 'Completed' : 'Not Completed'}`);
            });
        }
    })
    .command({
        command: 'completed',
        describe: "Mark task complete",
        builder: {
            id: {
                describe: 'Task ID',
                demandOption: true,
                type: 'number'
            }
        },
        handler(argv) {
            const tasks = readTasks();
            const task = tasks.find((t) => t.id === argv.id);
            if (!task) {
                console.log('Task not found.');
                return;
            }
            task.completed = true;
            writeTask(tasks);
            console.log(`Task ${argv.id} marked as completed.`);
        }
    })
    .command({
        command: 'remove',
        describe: 'Remove a task',
        builder: {
            id: {
                describe: 'Task ID',
                demandOption: true,
                type: 'number'
            }
        },
        handler(argv) {
            const tasks = readTasks();
            const updateTask = tasks.filter((t) => t.id !== argv.id);
            if (updateTask.length === tasks.length) {
                console.log('Task not found.');
                return;
            }
            writeTask(updateTask);
            console.log(`Task ${argv.id} was successfully removed.`);
        }
    })
    .parse();