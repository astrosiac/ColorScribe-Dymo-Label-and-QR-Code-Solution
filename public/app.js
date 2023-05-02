document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("job-form");
  const clearButton = document.getElementById("clear-form-btn");

  const colorImageBtn = document.getElementById("colorImageBtn");
  const colorImageInput = document.getElementById("colorImageInput");

  colorImageBtn.addEventListener("click", function () {
    colorImageInput.click();
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const colorImageFile = document.getElementById("colorImageInput").files[0];
    const checkboxes = document.querySelectorAll(".formula-checkbox");
    const numberInputs = document.querySelectorAll(".number-input");
    const formData = new FormData(event.target);

    formData.append("colorImage", colorImageFile);

    const formulaData = Array.from(checkboxes).reduce(
      (acc, checkbox, index) => {
        if (checkbox.checked) {
          acc.push({
            name: checkbox.value,
            value: parseInt(numberInputs[index].value),
          });
        }
        return acc;
      },
      []
    );

    formData.delete("formula[]");
    formulaData.forEach((formula, index) => {
      formData.append(`formula[${index}][name]`, formula.name);
      formData.append(`formula[${index}][value]`, formula.value);
    });

    try {
      const response = await fetch("/create-job", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Response data from /create-job:", data.colorName);
      const qrCodeUrl = data.qrCodeUrl;
      const customer = data.customer;
      const job = data.job;
      const colorName = data.colorName;

      // Send the jobId and qrCodeUrl to the server to generate a new label file
      const responseLabel = await fetch("/generate-label", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: customer,
          job: job,
          qrCodeUrl: qrCodeUrl,
          colorName: colorName,
        }),
      });

      const dataLabel = await responseLabel.json();
      const newLabelFilePath = dataLabel.newLabelFilePath;

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
            newLabelFilePath,
            function (label) {
              const qrCodeObject = label.getObjectByName("QRCodeObject");
              qrCodeObject.setAddress(qrCodeUrl);

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
      form.reset();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  });

  clearButton.addEventListener("click", function (event) {
    event.preventDefault();
    form.reset();
  });
});
