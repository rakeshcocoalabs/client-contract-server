
const Project = require('../models/projects')
const Client = require('../models/clients')
const MileStone = require('../models/milestone')

var PdfTable = require('voilab-pdf-table');
var PdfDocument = require('pdfkit');

const fs = require('fs')



const Invoice = require('../models/invoice')
const InvoiceLine = require('../models/invoiceline')

exports.add = async (req, res) => {

    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.set('Access-Control-Allow-Methods', 'POST');
    const params = req.body;

    const client = new Client(params)

    try {
        const output = await client.save()
        res.json({
            success: true,
            message: "added",

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
            message: "added",
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
        contractId: id,
        estimate: params
    }

    const milestone = new MileStone(obj)

    try {
        const output = await milestone.save()
        res.json({
            success: true,
            message: "added"
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

    if (req.query && req.query.search) {

        search = req.query.search.trim()


    }
    if (req.query && req.query.status) {

        status = req.query.status.trim()
    }


    var filter = {};

    if (search != "") {
        const clients = await Client.find({ contactName: { $regex: search, $options: "i" } }, { _id: 1 })

        var clientArr = [];

        for (x = 0; x < clients.length; x++) {

            let client = clients[x];

            clientArr.push(client._id);
        }


        filter.clientId = { $in: clientArr };
    }

    if (status != "") {
        filter.status = status;
    }

    const { page = 1, perPage = 10 } = req.query;

    const pagination = {
        skip: ((page - 1) * perPage),

        limit: perPage,
    }

    try {
        const output = await Project.find(filter, { _id: 0 }, pagination).populate('clientId')
        res.json({
            success: true,
            message: "listed",
            output: output
        })
    } catch (err) {
        res.send({
            success: 0,
            error: err.message
        })
    }
}

exports.listClients = async (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');

    try {
        const output = await Client.find({}, { _id: 1, name: 1, contactName: 1, email: 1 })
        res.json({
            success: true,
            message: "listed",
            output: output
        })
    } catch (err) {
        res.send({
            success: 0,
            error: err.message
        })
    }
}


exports.addInvoice = async (req, res) => {


    const params = req.body;

    //return res.send(params)

    console.log(params)

    const invoice = new Invoice(params)

    try {
        const output = await invoice.save()
        res.json({
            success: true,
            message: "added",
            output
        })
    } catch (err) {
        res.send({
            success: 0,
            error: err.message
        })
    }

    this.makePdf(params)
}

exports.addInvoiceLine = async (req, res) => {


    const params = req.body;

    const id = req.params.id;

    var obj = {
        invoiceId: id,
        estimate: params
    }

    const invoiceLine = new InvoiceLine(obj)

    try {
        const output = await invoiceLine.save()
        res.json({
            success: true,
            message: "added"
        })
    } catch (err) {
        res.send({
            success: 0,
            error: err.message
        })
    }
}



exports.makePdf = async (params) => {


    const client = await Client.findOne({name:params.name});

    console.log(params)

    // Create a document
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    // Saving the pdf file in root directory.
    doc.pipe(fs.createWriteStream('./files/example.pdf'));

    // Adding functionality


    // Adding image in the pdf.

    doc.image('./images/logo.jpeg', {
        fit: [100, 40],
        align: 'center',
        valign: 'center'
    });

    doc.fontSize(13).text('QUOLAM BUSINESS SOLUTIONS PVT LTD', 150, 80);
    doc.fontSize(13).text('GSTIN :27AAACQ2604H1ZQ', 150, 100);
    doc.fontSize(13).text('TAX INVOICE', 430, 80, { color: '#0000FF' });

    doc.fontSize(8).text('Bill to', 100, 130);
    doc.fontSize(8).text('Swaminathan somecompany ltd', 100, 140);
    doc.fontSize(8).text('GSTIN: 12357858', 100, 150);

    doc.fontSize(9).text('Ship to', 100, 170);
    doc.fontSize(9).text('Swaminathan somecompany ltd', 100, 180);

    doc.fontSize(9).text('Invoice no: 12345', 425, 130);
    doc.fontSize(9).text('contact person: Rakesh', 425, 140);

    doc.fontSize(9).text('Contact No:9061955456', 425, 160);
    doc.fontSize(9).text('invloice date:27/09/21', 425, 170);



    // doc.table([
    //     ["cell11", "cell21", "cell31"],
    //     ["cell12", "cell22", "cell32"],
    //     ["cell13", "cell23", "cell33"]
    // ], {
    //     width: 20,
    //     height: 40,
    //     x: 30,
    //     y: 40
    // });

    doc.fontSize(9).text('SL No:', 100, 220);
    doc.fontSize(9).text('Description', 150, 220);

    doc.fontSize(9).text('SAC', 250, 220);
    doc.fontSize(9).text('Taxable value', 290, 220);

    doc.fontSize(9).text('SGST', 380, 220);
    doc.fontSize(9).text('CGST', 430, 220);

    doc.fontSize(9).text('IGST', 480, 220);

    doc.fontSize(9).text('Rate', 370, 228);
    doc.fontSize(9).text('Amt', 400, 228);
    doc.fontSize(9).text('Rate', 420, 228);
    doc.fontSize(9).text('Amt', 450, 228);

    doc.fontSize(9).text('Rate', 470, 228);
    doc.fontSize(9).text('Amt', 500, 228);


    doc.fontSize(9).text('_______________________________________________________________________________________', 100, 236);
    


    doc.fontSize(9).text('1', 100, 250);
    doc.fontSize(9).text('Product support', 150, 250,90,20);

    doc.fontSize(9).text('998574', 250, 250);
    doc.fontSize(9).text('120000', 290, 250);

    doc.fontSize(9).text('5', 370, 250);
    doc.fontSize(9).text('6000', 400, 250);

    doc.fontSize(9).text('_______________________________________________________________________________________', 100, 340);

    doc.fontSize(9).text('Total', 150, 350);
    doc.fontSize(9).text('120000', 290, 350);
    doc.fontSize(9).text('6000', 380, 350);
    
    doc.fontSize(9).text('Total Invoicable value', 150, 370);
    doc.fontSize(9).text('126000', 380, 370);

    doc.fontSize(9).text('Total Invoicable value in words', 150, 390);
    doc.fontSize(9).text(inWords(126000), 380, 390);

    doc.fontSize(9).text('PAN:8952144', 100, 420);
    doc.fontSize(9).text('TAN:8952144', 100, 430);
    doc.fontSize(9).text('CIN:8952144', 100, 440);

    doc.fontSize(9).text('Details of payment through RTGS/NEFT', 200, 420);
    doc.fontSize(9).text('Bank:HDFC', 200, 430);
    doc.fontSize(9).text('Branch:Nerul', 200, 440);

    doc.fontSize(9).text('Account name:Rakesh Krishnan', 200, 450);
    doc.fontSize(9).text('Account no:26587122', 200, 460);

    doc.fontSize(9).text('IFSC Code:SBIN00123', 200, 470);
    doc.fontSize(9).text('Swift code:26587122', 200, 480);

    doc.fontSize(9).text('for Qualcon solutions private limited', 400, 480);


    doc.image('./images/seal.jpeg',100,520, {
        fit: [200, 80],
        align: 'center',
        valign: 'center'
    });
    doc.image('./images/sign.jpeg',300,520, {
        fit: [200, 80],
        align: 'center',
        valign: 'center'
    });

    doc.fontSize(9).text('Thank you for your business', 225, 610);

    doc.fontSize(9).text('Qualcon business solutions', 225, 620);

    doc.fontSize(9).text('204 millenium business park navi mumbai', 225, 630);


    doc.end();

    res.send("ok")
}

var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

function inWords (num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
}

