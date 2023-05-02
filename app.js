import { generateLabel } from "./server/labelLogic.js";
import express from "express";
import { addJobToNotion, updatePageWithQrCode } from "./server/notion.js";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Route handler for the root path
app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

// Route handler for the CSS file
app.get("/static/css/main.css", (req, res) => {
  res.set("Content-Type", "text/css");
  res.sendFile(path.resolve("static/css/main.css"));
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/create-job", upload.single("colorImage"), async (req, res) => {
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

    const colorImageUrl = req.file ? "/uploads/" + req.file.filename : "";

    const jobData = {
      customer,
      job,
      colorName,
      address,
      date,
      finish,
      texture,
      formulas: formula,
      color: colorImageUrl || "",
    };

    const { response: notionResponse, pageUrl } = await addJobToNotion(jobData);

    // const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
    //   pageUrl
    // )}`;

    await updatePageWithQrCode(notionResponse.id, pageUrl);

    res.json({ qrCodeUrl: pageUrl, colorName, customer, job });
  } catch (error) {
    console.error("Error in /create-job:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/generate-label", async (req, res) => {
  const { colorName, qrCodeUrl } = req.body;
  console.log("Inside generateLabel function");
  console.log("req.body:", colorName);

  // const data = encodeURIComponent(req.body.qrCodeUrl);
  const data = req.body.qrCodeUrl;
  const customerName = req.body.customer
    ? req.body.customer.replace(/\s+/g, "-")
    : undefined;
  const jobName = req.body.job ? req.body.job.replace(/\s+/g, "-") : undefined;
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
