import express from "express";
import { addJobToNotion } from "./server/notion.js";
import { generateQrCodeUrl } from "./server/qrCode.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/create-job", async (req, res) => {
  const jobData = req.body;

  const notionResponse = await addJobToNotion(jobData);
  const qrCodeUrl = await generateQrCodeUrl(jobData);

  res.json({ qrCodeUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
