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
    Name: {
      title: [
        {
          text: {
            content: jobData.name,
          },
        },
      ],
    },
  };

  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: newPage,
  });

  return response;
}

export { addJobToNotion };
