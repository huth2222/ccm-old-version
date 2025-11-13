const cron = require('node-cron');
const cronController = require('./controllers/cronController');
    // edit cronjob times
cron.schedule('30 1 * * *', async () => {
    // cron.schedule('*/2 * * * *', async () => {
    const today = new Date();

    // Date options
    const dateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    // Time options
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    // Format date
    const formattedDate = new Intl.DateTimeFormat('en-GB', dateOptions).format(today);

    // Format time manually
    const formattedTime = today.toLocaleTimeString('en-US', timeOptions);

    // Combine date and time
    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    // console.log(formattedDateTime);

    console.log("cron starting " + formattedDateTime);
    // let start = new Date();
    // let end = new Date();
    // let status = "success";

    try {
        const result = await cronController.importCustomerDaily({}, {});

        // // Create a new document in the dailySchema collection
        // const newDailyEntry = createDailyEntry(start, end, status, null, null);

        // await newDailyEntry.save(); // Save the new document to the database
        const today_end = new Date();

        // Date options
        const dateOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };

        // Time options
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };

        // Format date
        const formattedDate_end = new Intl.DateTimeFormat('en-GB', dateOptions).format(today_end);

        // Format time manually
        const formattedTime_end = today_end.toLocaleTimeString('en-US', timeOptions);

        // Combine date and time
        const formattedDate_end_end = `${formattedDate_end} ${formattedTime_end}`;
        console.log("cron finished " + formattedDate_end_end);
    } catch (error) {
        // status = "error";

        // const newDailyEntry = createDailyEntry(start, end, status, null, error);
        // await newDailyEntry.save(); // Save the new document to the database

        console.error("Error in cron job:", error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Bangkok"
});

// function createDailyEntry(start, end, status, count, detail_error) {
//     return new Daily({
//         start: start,
//         end: end,
//         status: status,
//         type: "customer",
//         // count: count,
//         detail_error: detail_error,
//     });
// }
