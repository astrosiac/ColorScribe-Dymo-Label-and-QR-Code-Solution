import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
const databaseId = process.env.NOTION_DATABASE_ID;

async function addJobToNotion(jobData) {
  console.log("Adding job to Notion: ", jobData);

  const newPage = {
    Customer: {
      title: [
        {
          text: {
            content: jobData.customer,
          },
        },
      ],
    },
    Job: {
      rich_text: [
        {
          text: {
            content: jobData.job,
          },
        },
      ],
    },
    ColorName: {
      rich_text: [
        {
          text: {
            content: jobData.colorName,
          },
        },
      ],
    },
    Address: {
      rich_text: [
        {
          text: {
            content: jobData.address,
          },
        },
      ],
    },
    Date: {
      date: {
        start: jobData.date,
      },
    },
    Finish: {
      select: {
        name: jobData.finish,
      },
    },
    Formula: {
      multi_select: [
        {
          name: jobData.formula,
        },
      ],
    },
  };

  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: newPage,
  });

  // Get the URL of the newly created page
  const pageUrl = response.url;
  return { response, pageUrl };
}

async function updatePageWithQrCode(pageId, qrCodeUrl) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      QrCode: {
        files: [
          {
            name: "QR Code",
            external: {
              url: qrCodeUrl,
            },
          },
        ],
      },
    },
  });
}

export { addJobToNotion, updatePageWithQrCode };
