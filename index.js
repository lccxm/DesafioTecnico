const axios = require('axios').default;

const year = "2022"

axios
  .get("https://interview.adpeai.com/api/v2/get-task")
  .then(function (response) {

    const employeeInfo = GetEmployeeWithBiggestAmountSum(response.data.transactions , year)


    const alphaTransactionIDs = filterAlphaTransactions(employeeInfo.transactions.transactionInfo)

    const result = generateResponse(employeeInfo.maxUserId, alphaTransactionIDs)

    console.log(result)

    axios.post("https://interview.adpeai.com/api/v2/submit-task", result)
    .then((response) => {
      console.log(response);
    });

  });

  function GetEmployeeWithBiggestAmountSum(transactions, year) {
    const userTransactions = {};
    let maxUserId = null;
    let maxAmount = 0;

    transactions.forEach(transaction => {
        const transactionYear = transaction.timeStamp.substring(0, 4)
        const employeeID = transaction.employee.id
        if (transactionYear == year) {
            if (!userTransactions[employeeID]) {
                userTransactions[employeeID] = { sum: 0, transactionInfo: [] };
            }
            userTransactions[employeeID].sum += transaction.amount;
            userTransactions[employeeID].transactionInfo.push({transactionID: transaction.transactionID, type: transaction.type});
    
            if(userTransactions[employeeID].sum > maxAmount) {
                maxUserId = employeeID
                maxAmount = userTransactions[employeeID].sum
            } 
        }
    });

    return {
        maxUserId: maxUserId,
        transactions: userTransactions[maxUserId]
    }
}

function filterAlphaTransactions(transactions) {
    let filteredTransactions = [];
    transactions.forEach(transaction => {
        if (transaction.type == 'alpha') {
            filteredTransactions.push(transaction.transactionID);
        }
    });
    return filteredTransactions;
}

function generateResponse(employeeID, alphaTransactionIDs) {
    return {
        id: employeeID,
        result: alphaTransactionIDs
    }
}