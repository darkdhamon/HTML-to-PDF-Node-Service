var Service = require('node-windows').Service;

var svc = new Service({
    name: "PDF Generator",
    description: "This generates a PDF form HTML and returns it to the user.",
    script: 'c:\\PDFService\\GenPDFService.js'
});

svc.on('install',
    function() {
        svc.start();
    });

svc.install();