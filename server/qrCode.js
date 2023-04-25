import QRCode from "qrcode";

async function generateQrCodeUrl(jobData) {
  const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(jobData), {
    errorCorrectionLevel: "H",
  });

  return qrCodeUrl;
}

export { generateQrCodeUrl };
