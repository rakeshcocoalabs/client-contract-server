
const Project = require('../models/projects')
const Client = require('../models/clients')
const MileStone = require('../models/milestone')

var PdfTable = require('voilab-pdf-table');
var PdfDocument = require('pdfkit');

const fs = require('fs')



const Invoice = require('../models/invoice')
const InvoiceLine = require('../models/invoiceline')

const InvoiceDoc = require('../models/invoiceDocument');


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


exports.getClient = async (req, res) => {


    const name = req.params.name;

    console.log("giii", name)



    try {
        const output = await Project.findOne({ name: name });

        console.log(output)

        const output1 = await Client.findOne({ name: name });
        return res.json({
            success: true,
            message: "added",
            output: output1

        })
    } catch (err) {
        return res.send({
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

exports.updateClient = async (req, res) => {

    const params = req.body;

    const id = req.params.id;

    try {
        const result = await Client.updateOne({ _id: id }, params);

        return res.send({
            success: true,
            message: "updated"
        })
    }
    catch (e) {
        return res.send({
            success: success,
            message: e.message
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
        const clients = await Client.find({ name: { $regex: search, $options: "i" } }, { _id: 1 })

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

exports.listInvoices = async (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');

    try {
        const output = await Invoice.find({})
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

    var client = await Client.findOne({ email: params.email }, { _id: 1 })

    var lastInvoice = await Client.find();

    var latestInv = lastInvoice[lastInvoice.length - 1].number

    var object = {
        email: params.email,
        name: params.name,
        contactName: params.contactName,
        number: params.number,
        clientId: client._id,
        invoiceDate: params.date,
        date:params.strDate,
        description:params.description
    }


    const invoice = new Invoice(object)

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
    const id = params.id;

    var obj = {
        invoiceId: id,
        estimate: params.estimate
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

exports.download = async (req, res) => {

    let __basedir = __dirname

    const directoryPath = "/root/client-contract-server/files/example.pdf"
  

    return res.download(directoryPath)
}



exports.makePdf = async (req, res) => {


    var tableOffset = 240
    var address = []
    var addressShip = []
    var dateinFmt = ""
    var contactName = ""
    var phone = ""
    var invNum = 0;
    var invDate = "";
    var address1 = ""; var address2 = ""; var address3 = ""
    var address4 = ""; var address5 = ""; var address6 = ""
    if (req.body) {
        const client = await Client.findOne({ name: req.body.name });

        if (client) {
            address = client.address1
            if (address.length > 0) { address1 = address[0] }
            if (address.length > 1) { address2 = address[1] }
            if (address.length > 2) { address3 = address[2] }

            addressShip = client.address2
            if (addressShip.length > 0) { address4 = addressShip[0] }
            if (addressShip.length > 1) { address5 = addressShip[1] }
            if (addressShip.length > 2) { address6 = addressShip[2] }
        }

        var estimate = []


        if (req.body.id) {
            const invoiceLine = await InvoiceLine.findOne({ invoiceId: req.body.id })

            if (invoiceLine.estimate) {
                estimate = invoiceLine.estimate;

            }

            const invoice = await Invoice.findOne({ _id: req.body.id }).populate('clientId')

            invNum = invoice.number;

            invDate = invoice.date;

            var invDates = invDate.split(" ");

            var month = invDates[1];



            const months = ["Jan", "Feb", "Mar", "APR", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

            let monthNum = months.indexOf(month)

            let day = invDates[2]

            let yr = invDates[3]


            dateinFmt = day + "/" + monthNum.toString() + "/" + yr;

            contactName = invoice.contactName;

            if (invoice.clientId && invoice.clientId.phone) {

                phone = invoice.clientId.phone
            }





        }
    }
    else {
        return
    }


    // console.log(params)

    // Create a document
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    const numberRand = (Math.floor(Math.random() * 90000) + 10000).toString();
    const path = 'http://143.198.168.131/var/www/html/' + numberRand;
    // Saving the pdf file in root directory.
    doc.pipe(fs.createWriteStream(path));

    if(req.body && req.body.id){
        let update = await Invoice.updateOne({_id:req.body.id},{path:path})
    }

    // Adding functionality


    // Adding image in the pdf.

    doc.image('./images/logo.jpeg', {
        fit: [100, 40],
        align: 'center',
        valign: 'center'
    });

    doc.font('Helvetica-Bold').fontSize(13).text('QUOLAM BUSINESS SOLUTIONS PVT LTD', 150, 80);
    doc.fontSize(13).text('GSTIN :27AAACQ2604H1ZQ', 180, 100);
    doc.font('Helvetica-Bold').fontSize(17).fillColor('#6666aa').text('TAX INVOICE', 430, 65, { color: '#0000FF' });

    doc.font('Helvetica-Bold').fontSize(8).fillColor('black').text('Bill to', 100, 130);
    doc.font('Helvetica').fontSize(8).text(address1, 100, 140, 25, 20);
    doc.font('Helvetica').fontSize(8).text(address2, 100, 150, 100, 20);
    doc.font('Helvetica').fontSize(8).text(address3, 100, 160, 100, 20);
    doc.fontSize(8).font('Helvetica-Bold').text('GSTIN: 12357858', 100, 170);

    doc.fontSize(9).text('Address', 100, 180);
    doc.font('Helvetica').fontSize(9).text(address4, 100, 190);
    doc.font('Helvetica').fontSize(9).text(address5, 100, 200);
    doc.font('Helvetica').fontSize(9).text(address6, 100, 210);

    doc.fontSize(9).text('Invoice no: ' + invNum, 425, 130);

    doc.fontSize(9).text('contact person: ' + contactName, 425, 140);

    doc.fontSize(9).text('Contact No:' + phone, 425, 150);
    doc.font('Helvetica-Bold').fontSize(9).text("invloice date:" + dateinFmt, 425, 170);



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

    doc.font('Helvetica').fontSize(9).text('SL No:', 100, tableOffset);
    doc.fontSize(9).text('Description', 150, tableOffset);

    doc.fontSize(9).text('SAC', 250, tableOffset);
    doc.fontSize(9).text('Taxable value', 290, tableOffset);

    doc.fontSize(9).text('SGST', 380, tableOffset);
    doc.fontSize(9).text('CGST', 430, tableOffset);

    doc.fontSize(9).text('IGST', 480, tableOffset);

    doc.fontSize(9).text('Rate', 370, tableOffset + 8);
    doc.fontSize(9).text('Amt', 395, tableOffset + 8);
    doc.fontSize(9).text('Rate', 420, tableOffset + 8);
    doc.fontSize(9).text('Amt', 450, tableOffset + 8);

    doc.fontSize(9).text('Rate', 470, tableOffset + 8);
    doc.fontSize(9).text('Amt', 500, tableOffset + 8);


    doc.fontSize(9).text('_______________________________________________________________________________________', 100, tableOffset + 16);

    console.log("pi", estimate.length, estimate)

    var total = 0;
    var totlaTax = 0;

    for (let x = 0; x < estimate.length; x++) {

        let obect = estimate[x];
        let offset = tableOffset + 32 + (x * 12)
        doc.fontSize(9).text((x + 1).toString(), 100, offset);
        doc.fontSize(9).text(obect.description, 150, offset, 90, 20);

        doc.fontSize(9).text(obect.sac, 250, offset);
        doc.fontSize(9).text(obect.taxable, 290, offset);

        doc.fontSize(9).text('5', 370, offset);
        let tax = obect.taxable * 0.05;
        doc.fontSize(9).text(tax.toString(), 395, offset);

        total = total + parseInt(obect.taxable)

        totlaTax = totlaTax + tax;

    }



    doc.fontSize(9).text('_______________________________________________________________________________________', 100, 334);



    doc.fontSize(9).text('Total', 150, 350);
    doc.fontSize(9).text(total.toString(), 290, 350);
    doc.fontSize(9).text(totlaTax.toString(), 380, 350);

    doc.fontSize(9).text('Total Invoicable value', 150, 370);
    doc.fontSize(9).text((totlaTax + total).toString(), 380, 370);

    doc.fontSize(9).text('Total Invoicable value in words', 150, 390);
    doc.fontSize(9).text(inWords(totlaTax + total), 380, 390);

    doc.fontSize(9).text('PAN:8952144', 100, 420);
    doc.fontSize(9).text('TAN:8952144', 100, 430);
    doc.fontSize(9).text('CIN:8952144', 100, 440);

    doc.fontSize(9).text('Details of payment through RTGS/NEFT', 280, 420);
    doc.fontSize(9).text('Bank:HDFC', 280, 430);
    doc.fontSize(9).text('Branch:Nerul', 280, 440);

    doc.fontSize(9).text('Account name:Rakesh Krishnan', 280, 450);
    doc.fontSize(9).text('Account no:26587122', 280, 460);

    doc.fontSize(9).text('IFSC Code:SBIN00123', 280, 470);
    doc.fontSize(9).text('Swift code:26587122', 280, 480);

    doc.fontSize(9).text('for Qualcon solutions private limited', 300, 500);


    doc.image('./images/seal.jpeg', 60, 520, {
        fit: [200, 80],
        align: 'center',
        valign: 'center'
    });
    doc.image('./images/sign.jpeg', 400, 520, {
        fit: [200, 80],
        align: 'center',
        valign: 'center'
    });

    doc.font('Helvetica-Bold').fontSize(9).text('Thank you for your business', 275, 610);

    doc.fontSize(9).text('Qualcon business solutions', 100, 650);

    doc.font('Helvetica').fontSize(9).text('204 millenium business park navi mumbai', 100, 660);
    doc.font('Helvetica').fontSize(9).text('Nerul navi mumbai near metro station', 100, 670);


    doc.end();

    const params = req.body;
    if (!params) { return }

    console.log(params, "kji")

    let name = params.name;

    var numId = 1;

    let last = await InvoiceDoc.find({});

    if (last.length > 0) {
        let lastItem = last[last.length - 1]
        let orderNum = lastItem.invoiceNumber;


        numId = orderNum + 1;

    }

    const numIdStr = pad_with_zeroes(numId, 6)

    const d1 = new Date();

    const d2 = d1.getTime()

    const newobj = new InvoiceDoc({
        name: params.name,
        invoiceId: numIdStr,
        invoiceNumber: numId,
        date: d2,
        path: numberRand
    })

    await newobj.save();



    res.send("ok")
}

var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
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


function pad_with_zeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}

