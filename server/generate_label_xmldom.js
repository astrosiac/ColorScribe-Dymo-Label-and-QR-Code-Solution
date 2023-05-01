const QRCode = require("qrcode");
const { DOMImplementation, XMLSerializer } = require("xmldom");
const fs = require("fs");

function customSerializeToString(doc) {
  const serializer = new XMLSerializer();
  const originalStr = serializer.serializeToString(doc);
  const modifiedStr = originalStr.replace(/<(\w+)([^>]*)><\/\1>/g, "<$1$2/>");
  return modifiedStr;
}

async function generateLabel(colorName, data) {
  // Generate QR code
  const qrCodeDataURL = await QRCode.toDataURL(data);

  // Remove "data:image/png;base64," from the beginning of the data URL
  const qrCodeBase64 = qrCodeDataURL.replace(/^data:image\/png;base64,/, "");

  // Create XML template
  const dom = new DOMImplementation();
  const doc = dom.createDocument(null, "Label");
  const labelElement = doc.documentElement;
  labelElement.setAttribute("Version", "8.0");
  labelElement.setAttribute("Units", "twips");

  const text = doc.createElement("Text");
  text.setAttribute("ObjectName", "colorName");
  text.appendChild(doc.createTextNode(colorName));
  labelElement.appendChild(text);

  const image = doc.createElement("Image");
  image.setAttribute("ObjectName", "QRCode");
  image.appendChild(doc.createTextNode(qrCodeBase64));
  labelElement.appendChild(image);

  const xmlStr = customSerializeToString(doc);

  // Save XML to file
  fs.writeFileSync("label_xmldom.xml", xmlStr);

  // Print label
  const labelXml = fs.readFileSync("label_xmldom.xml", "utf-8");
  const printers = dymo.label.framework.getPrinters();
  if (printers.length == 0) {
    throw new Error("No Dymo printers installed.");
  }
  const printerName = printers[0].name;
  const labelSet = dymo.label.framework.openLabelFile(labelXml);
  const label = labelSet.getLabelObject();
  label.print(printerName);
}

// Replace with your colorName and Notion page URL
const colorName = "Red";
const data = "https://example.com";

generateLabel(colorName, data);
