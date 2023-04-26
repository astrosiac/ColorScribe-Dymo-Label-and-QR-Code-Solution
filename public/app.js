document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("job-form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      const response = await fetch("/create-job", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const qrCodeUrl = data.qrCodeUrl;

      // Display the QR code
      const qrCodeImage = document.getElementById("qr-code");
      qrCodeImage.src = qrCodeUrl;
      qrCodeImage.style.display = "block";

      // Load the label template and set the QR code URL
      const script = document.createElement("script");
      script.src =
        "https://s3.amazonaws.com/download.dymo.com/dymo/Software/JavaScript/dymo.connect.framework.js";
      script.onload = function () {
        dymo.label.framework.init(function () {
          dymo.label.framework.openLabelFile(
            "C:/Users/savvy/Projects/ziaMaterials/uploads/dymo-test-file-3.label",
            function (label) {
              const qrCodeObject = label.getObjectByName("QRCodeObject");
              qrCodeObject.setAddress(qrCodeUrl);
              console.log(qrCodeObject);
              // Print the label
              const printers = dymo.label.framework.getPrinters();
              const printer = printers.filter(
                (printer) => printer.printerType === "LabelWriterPrinter"
              )[0];
              if (printer) {
                label.print(printer.name);
              } else {
                console.error("No DYMO LabelWriter printer found.");
              }
            },
            function (error) {
              console.error("Error loading the label template:", error);
            }
          );
        });
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  });
});
