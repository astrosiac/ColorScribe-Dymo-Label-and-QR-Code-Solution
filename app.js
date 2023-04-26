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
    const { name, customer, job, colorName, address, date, finish, formula } =
      req.body;

    const jobData = {
      name,
      customer,
      job,
      colorName,
      address,
      date,
      finish,
      formula,
      color: "",
    };

    const { response: notionResponse, pageUrl } = await addJobToNotion(jobData);

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      pageUrl
    )}`;

    await updatePageWithQrCode(notionResponse.id, qrCodeUrl);

    res.json({ qrCodeUrl: qrCodeUrl });
  } catch (error) {
    console.error("Error in /create-job:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
