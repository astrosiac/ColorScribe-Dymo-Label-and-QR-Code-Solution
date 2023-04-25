document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("job-form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const jobName = document.getElementById("job-name").value;

    // Add the job to the Notion database and get the QR code URL
    const response = await fetch("/create-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: jobName }),
    });
    const data = await response.json();
    const qrCodeUrl = data.qrCodeUrl;

    //Display the QR code
    const qrCodeImage = document.getElementById("qr-code");
    qrCodeImage.src = qrCodeUrl;
    qrCodeImage.style.display = "block";

    // // Load the label template and set the QR code URL
    // const label = dymo.label.framework.openLabelXml(
    //   "path/to/your/label_template.label"
    // );
    // const qrCodeObject = label.getObjectByName("QRCodeObject");
    // qrCodeObject.setAddress(qrCodeUrl);

    // // Print the label
    // const printers = dymo.label.framework.getPrinters();
    // const printerName = printers[0].name; // Replace with the correct printer name
    // label.print(printerName);
  });
});
