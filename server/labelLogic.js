import QRCode from "qrcode";
import { DOMParser, XMLSerializer } from "xmldom";
import fs from "fs";

function customSerializeToString(doc) {
  const serializer = new XMLSerializer();
  const originalStr = serializer.serializeToString(doc);
  const modifiedStr = originalStr.replace(/<(\w+)([^>]*)\/>/g, "<$1$2></$1>");
  return modifiedStr;
}

async function generateLabel(colorName, data, newLabelFilePath) {
  // Generate QR code
  const qrCodeDataURL = await QRCode.toDataURL(data);

  // Remove "data:image/png;base64," from the beginning of the data URL
  const qrCodeBase64 = qrCodeDataURL.replace(/^data:image\/png;base64,/, "");

  // Read the template.xml file
  const templateXml = fs.readFileSync("uploads/template.xml", "utf-8");

  // Parse the XML and update with the color name and QR code data
  const parser = new DOMParser();
  const doc = parser.parseFromString(templateXml, "application/xml");

  // Update the color name and QR code data
  const textElement = doc.getElementsByTagName("Text")[0];
  const dataElement = doc.getElementsByTagName("Data")[1];

  textElement.textContent = colorName;
  dataElement.textContent = qrCodeBase64;

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
