
const Project = require('../models/projects')
const Client = require('../models/clients')

exports.add = async (req, res) => {


    const params = req.body;
 
    const client = new Client(params)

    try {
        const output = await client.save()
        res.json({
            success: true,
            message:"added"
        })
    } catch (err) {
        res.send({
            success: 0,
            error: err.message
        })
    }
}


exports.addProject = async (req, res) => {

    
    const params = req.body;
 
    const project = new Project(params)

    try {
        const output = await project.save()
        res.json({
            success: true,
            message:"added"
        })
    } catch (err) {
        res.send({
            success: 0,
            error: err.message
        })
    }
}

exports.listProject = async (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');

    var search = ""



    if (req.query  && req.query.search) {

        search = req.query.search.trim() 
    }
    

    var filter = {};

    if(search != ""){
        const clients = await Client.find({ contactName: { $regex: search, $options: "i" } },{_id:1})

        var clientArr = [];

        for (x=0;x<clients.length;x++) {

            let client = clients[x];

            clientArr.push(client._id);
        }

        filter = {'clientId': {$in: clientArr}};
    }

    const {page=1,perPage=10} = req.body;
 
    const pagination = {
        skip:((page-1) * perPage),

        limit:perPage,
    }

    try {
        const output = await Project.find(filter,{_id:0},pagination).populate('clientId')
        res.json({
            success: true,
            message:"listed",
            output: output
        })
    } catch (err) {
        res.send({
            success: 0,
            error: err.message
        })
    }
}