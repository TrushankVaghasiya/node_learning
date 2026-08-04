import yargs  from "yargs";
import fs from 'fs'
import { hideBin } from "yargs/helpers";


const ExpenseFile = 'expenses.json';

const readExpense = () =>{
    const dataBuffer = fs.readFileSync(ExpenseFile);
    const expensesString = dataBuffer.toString();
    return JSON.parse(expensesString);
}



yargs(hideBin(process.argv))
    .command({
        command: 'add',
        describe: 'to add expense to the list',
        builder:{
            description:{
                describe:'what is the expense for',
                demandOption: true,
                type: 'string'
            },

            amount:{
                describe:'amount of the expense',
                demandOption: true,
                type : 'number'
            }
        },
        handler(argv){
            const expenses = readExpense();
            const maxId = expenses.reduce((max, expense) => (expense.id > max ? expense.id : max), 0);
            const d = new Date();
            const newExpens = {
                id:maxId+1,
                description:argv.description,
                amount:argv.amount,
                day:String(d.getDate()).padStart(2, '0'),
                month:String(d.getMonth() + 1).padStart(2, '0'),
                year:d.getFullYear()
            }
            expenses.push(newExpens);
            const jsonExpenses = JSON.stringify(expenses , null , 2);
            fs.writeFileSync(ExpenseFile , jsonExpenses);
            console.log(`Your expense is successfully added with id = ${maxId+1}`);
        }
    })
    .command({
        command:'update',
        describe:'update the specific expense',
        builder:{
            id:{
                describe:'id of the task to update',
                demandOption: true,
                type: 'number'
            },
            description:{
                describe:'the updated description',
                demandOption: false,
                type: 'string'
            },
            amount:{
                describe:'the updated amount',
                demandOption: false,
                type: 'number'
            }
        },
        handler(argv){
            const expenses = readExpense();
            let updated;
            expenses.forEach(expense => {
                if(expense.id==argv.id){
                    if(argv.description){
                        expense.description=argv.description;
                    }
                    if(argv.amount){
                        expense.amount=argv.amount;
                    }
                    updated = expense;
                }
            });
            const jsonExpenses = JSON.stringify(expenses , null , 2);
            fs.writeFileSync(ExpenseFile , jsonExpenses);
            console.log(
        `Your expense with id = ${argv.id} was successfully updated (${updated.description} - ${updated.amount})`
      );
        }
    })
    .command({
        command:'delete',
        describe:'to delete the certain expense',
        builder:{
            id:{
                describe:'id of the expense to delete',
                demandOption:true,
                type:'number'
            }
        },
        handler(argv){
             const expenses = readExpense();
             const filteredExpenses = expenses.filter((expense) => expense.id!=argv.id);
             const jsonExpenses = JSON.stringify(filteredExpenses , null , 2);
            fs.writeFileSync(ExpenseFile , jsonExpenses);
        }
    })
    .command({
        command:'List',
        describe:'lists all the expenses',
        handler(){
            const expenses = readExpense();
            expenses.forEach(expense =>{
                console.log(`id : ${expense.id}   description: ${expense.description}    Date: ${expense.day}-${expense.month}-${expense.year}   amount:${expense.amount}`);
            });
        }
    })
    .command({
        command:'view',
        describe:'view the specific expense on the basis of id',
        builder:{
            id:{
                describe:'id of the expense to view',
                demandOption:true,
                type:'number'
            }
        },
        handler(argv){
            const expenses = readExpense();
            expenses.forEach(expense =>{
                if(expense.id==argv.id){
                     console.log(`id : ${expense.id}   description: ${expense.description}    Date: ${expense.day}-${expense.month}-${expense.year}   amount:${expense.amount}`);
                }
            })
        }
    })
    .command({
        command:'summary',
        describe:'to summarize all the expenses',
        builder:{
            month:{
                describe:'summary of the amount of the specific month',
                demandOption:false,
                type:'number'
            }
        },
        handler(argv){
            if(!argv.month){
                const expenses = readExpense();
                const sum= expenses.reduce((sum , expense) => (sum+expense.amount) ,0);
                console.log(`Total Expense : ${sum}`);
            }
            else{
                const expenses = readExpense();
                const sum = expenses.reduce((sum , expense) => (expense.month==argv.month?sum+expense.amount:sum) , 0);
                console.log(`Total Expens of ${argv.month} : ${sum}`);
            }
        }
    })
    .parse();