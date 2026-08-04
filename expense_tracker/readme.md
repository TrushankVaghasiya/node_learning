# Expense Tracker

This application allows you to maintain your expenses using cli where you can manage your expenses and keep track of it . This project was mainly aimed for logic building and strengthen the foundation of yargs library

# Usage

- **Add :** node index.js add --description [description of the expense] --amount [amount spent]
- **Update :** node index.js update --id [id of expense to update] --description(optional) [updated description] --amount(optional) [updated amount]
- **Delete :** node index.js delete --id [id of the expense to delete]
- **List :** node index.js List
- **view :** node index.js view --id [id of the expense to view]
- **Summary :** node index.js summary --month(opitonal) [month with padding 0 if needed to view the summary of specific month]