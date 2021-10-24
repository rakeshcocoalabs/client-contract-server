
const Project = require('../models/projects')
const Client = require('../models/clients')
const MileStone = require('../models/milestone')

exports.add = async (req, res) => {

    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.set('Access-Control-Allow-Methods', 'POST');
    const params = req.body;
 
    const client = new Client(params)

    try {
        const output = await client.save()
        res.json({
            success: true,
            message:"added",
            
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

    //return res.send(params)
 
    const project = new Project(params)

    try {
        const output = await project.save()
        res.json({
            success: true,
            message:"added",
            output
        })
    } catch (err) {
        res.send({
            success: 0,
            error: err.message
        })
    }
}

exports.addProjectMilestone = async (req, res) => {

    
    const params = req.body;

    const id = req.params.id;

    var obj = {
        contractId:id,
        estimate:params
    }
 
    const milestone = new MileStone(obj)

    try {
        const output = await milestone.save()
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

    var status = ""

    if (req.query  && req.query.search) {

        search = req.query.search.trim() 

      
    }
    if (req.query  && req.query.status) {

        status = req.query.status.trim() 
    }
    

    var filter = {};

    if(search != ""){
        const clients = await Client.find({ contactName: { $regex: search, $options: "i" } },{_id:1})

        var clientArr = [];

        for (x=0;x<clients.length;x++) {

            let client = clients[x];

            clientArr.push(client._id);
        }
        

        filter.clientId =  {$in: clientArr};
    }

    if(status != ""){
        filter.status = status;
    }

    const {page=1,perPage=10} = req.query;
 
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