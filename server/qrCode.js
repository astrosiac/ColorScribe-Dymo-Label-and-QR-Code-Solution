import QRCode from "qrcode";

async function generateQrCodeUrl(
  jobData,
  scale = 1,
  errorCorrectionLevel = "L"
) {
  const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(jobData), {
    errorCorrectionLevel: errorCorrectionLevel,
    scale: scale,
  });

  return qrCodeUrl;
}

export { generateQrCodeUrl };
