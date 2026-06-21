const cron = require('node-cron');
const Item = require('../models/item');

//testing for every minute
cron.schedule('* * * * *', async()=>{
    console.log("checking database for expiring items...");
    
    const today = new Date();
    const fourtyEightHoursFromNow = new Date();
    fourtyEightHoursFromNow.setDate(today.getDate() + 2);

    try{
        const expiringItems = await Item.find({
            expiry:{
                $gte: today,
                $lte: fourtyEightHoursFromNow
            }
        });
        if(expiringItems.length>0){
            console.log(`ALERT : you have ${expiringItems.length} expiring soon!`)
            expiringItems.forEach(item =>{
                console.log(`- ${item.itemName} expires on ${item.expiry.toDateString()}`)
            });
        }else{
            console.log("checked , everything is fresh for now !");
        }
    }catch (error){
        console.error('Error running expiry check:', error);
    }
});