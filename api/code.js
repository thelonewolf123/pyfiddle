import mongodbClient from './lib/mongodb'

module.exports = async (req, res) => {
    await mongodbClient;
    res.json({
        result: "Connected to mongo db"
    })
};