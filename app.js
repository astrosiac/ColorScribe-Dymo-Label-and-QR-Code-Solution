import { generateLabel } from "./server/labelLogic.js";
import express from "express";
import { addJobToNotion, updatePageWithQrCode } from "./server/notion.js";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const upload = multer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("public/index.html");
});

app.post("/create-job", upload.none(), async (req, res) => {
  try {
    const {
      customer,
      job,
      colorName,
      address,
      date,
      finish,
      texture,
      formula,
    } = req.body;

    const jobData = {
      customer,
      job,
      colorName,
      address,
      date,
      finish,
      texture,
      formula,
      color: "",
    };

    const { response: notionResponse, pageUrl } = await addJobToNotion(jobData);

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
      pageUrl
    )}`;

    await updatePageWithQrCode(notionResponse.id, qrCodeUrl);

    res.json({ qrCodeUrl: qrCodeUrl });
  } catch (error) {
    console.error("Error in /create-job:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/generate-label", async (req, res) => {
  console.log("Inside generateLabel function");
  console.log("req.body:", req.body);
  const colorName = req.body.colorName;
  const data = encodeURIComponent(req.body.qrCodeUrl);
  const customerName = req.body.customer.replace(/\s+/g, "-");
  const jobName = req.body.job.replace(/\s+/g, "-");
  const newLabelFilePath = `uploads/${customerName}-${jobName}.dymo`;

  try {
    // Call the generateLabel function
    await generateLabel(colorName, data, newLabelFilePath);

    // Send the new label file path to the client
    res.status(200).send({ newLabelFilePath: newLabelFilePath });
  } catch (error) {
    console.error("Error generating the new label file:", error);
    res.status(500).send({ error: "Error generating the new label file" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
