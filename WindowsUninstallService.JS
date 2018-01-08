var Service = require('node-windows').Service;

var svc = new Service({
    name: "PDF Generator",
    description: "This generates a PDF form HTML and returns it to the user.",
    script: 'c:\\PDFService\\GenPDFService.js'
});

svc.on('uninstall',
    function() {
        console.log("Uninstall complete");
    });

svc.install();

svc.uninstall("PDF Generator");