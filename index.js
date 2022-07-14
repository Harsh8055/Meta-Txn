const schedule = require("node-schedule");

const interval = 60;


schedule.scheduleJob("*/1 * * * * *", () => {
    console.log('i ran');
})