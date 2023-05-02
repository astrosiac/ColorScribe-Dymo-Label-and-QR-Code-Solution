import QRCode from "qrcode";
import { DOMParser, XMLSerializer } from "xmldom";
import fs from "fs";

function customSerializeToString(doc) {
  const serializer = new XMLSerializer();
  const originalStr = serializer.serializeToString(doc);
  const modifiedStr = originalStr.replace(
    /<(\w+)([^>]*)\/>/g,
    (match, tag, attrs) => {
      if (tag === "DYMOThickness") {
        return match;
      }
      return `<${tag}${attrs}></${tag}>`;
    }
  );
  return modifiedStr;
}

async function generateLabel(colorName, data, newLabelFilePath) {
  console.log("Inside generateLabel function");
  console.log("colorName:", colorName);
  console.log("data:", data);
  console.log("newLabelFilePath:", newLabelFilePath);
  // Generate QR code
  const qrCodeDataURL = await QRCode.toDataURL(data);

  // Remove "data:image/png;base64," from the beginning of the data URL
  const qrCodeBase64 = qrCodeDataURL.replace(/^data:image\/png;base64,/, "");

  // Read the template.xml file
  const templateXml = fs.readFileSync("uploads/template.xml", "utf-8");

  // Parse the XML and update with the color name and QR code data
  const parser = new DOMParser();
  const doc = parser.parseFromString(templateXml, "application/xml");

  // Update the color name, QR code data, DataString and WebAddressDataHolder
  const textElement = doc.getElementsByTagName("Text")[0];
  const qrCodeDataElement = doc.getElementsByTagName("Data")[1];
  const imageDataStringElement = doc.getElementsByTagName("DataString")[0];
  const webAddressDataHolderElement = doc.getElementsByTagName("DataString")[1];

  textElement.textContent = colorName;
  qrCodeDataElement.textContent = ""; // Clear the existing content
  imageDataStringElement.textContent = qrCodeBase64;
  webAddressDataHolderElement.textContent = data;

  // Create a new DataString element for the QRCodeObject's Data
  const newDataStringElement = doc.createElement("DataString");
  newDataStringElement.textContent = qrCodeBase64;
  qrCodeDataElement.appendChild(newDataStringElement);

  // Convert the modified XML object back to a string using the custom function
  const modifiedXml = customSerializeToString(doc);

  // Save XML to file
  if (newLabelFilePath) {
    fs.writeFile(
      newLabelFilePath,
      modifiedXml,
      { encoding: "utf8" },
      function (err) {
        if (err) throw err;
        console.log("Label file saved!");
      }
    );
  } else {
    console.log("New label file path is not defined.");
  }
}

export { generateLabel };
