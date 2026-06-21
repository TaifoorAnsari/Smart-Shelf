const express = require('express');
const router = express.Router();
const Item = require('../models/item');

//add an item 
router.post('/add', async(req,res)=>{
    try{
        const {itemName, category, expiry} = req.body;
        const newItem = new Item({
            itemName,
            category,
            expiry: new Date(expiry)
        });
        await newItem.save();
        res.status(201).json({ message: "Item added successfully!", item: newItem });
    }catch (error){
        res.status(500).json({ error: error.message });
    }
});

//get all items sorted by expiry
router.get('/all', async(req,res)=>{
    try{
        // 1 means ascending order (closest expiry date first)
        const Items = await Item.find().sort({expiry: 1});
        res.status(200).json(Items);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;