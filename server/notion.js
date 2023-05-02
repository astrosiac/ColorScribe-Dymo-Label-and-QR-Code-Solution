import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
const databaseId = process.env.NOTION_DATABASE_ID;

function getNotionPropertyName(formulaName) {
  // Replace this switch statement with the correct mapping of formula names to Notion property names.
  switch (formulaName) {
    case "Bright Red":
      return "Bright Red";
    case "Brown Oxide":
      return "Brown Oxide";
    case "Lamp Black":
      return "Lamp Black";
    case "Magenta":
      return "Magenta";
    case "Phthalo Green":
      return "Phthalo Green";
    case "Raw Umber":
      return "Raw Umber";
    case "Red Oxide":
      return "Red Oxide";
    case "TiWhite":
      return "TiWhite";
    case "V. Yellow":
      return "V. Yellow";
    case "Yellow Ox":
      return "Yellow Ox";
    case "BC Blue":
      return "BC Blue";
    case "Red Interior":
      return "Red Interior";
    default:
      return "";
  }
}

function convertFormulasToMultiSelect(formulas) {
  return formulas.map((formula) => {
    return { name: formula.name };
  });
}

async function addJobToNotion(jobData) {
  console.log("Adding job to Notion: ", jobData);

  const formulasMultiSelect = convertFormulasToMultiSelect(jobData.formulas);

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
    Texture: {
      select: {
        name: jobData.texture,
      },
    },
    Formula: {
      multi_select: formulasMultiSelect,
    },
  };

  // Add a number property for each formula with its respective value
  jobData.formulas.forEach((formula) => {
    const notionPropertyName = getNotionPropertyName(formula.name);
    if (notionPropertyName) {
      newPage[notionPropertyName] = {
        number: parseFloat(formula.value),
      };
    }
  });

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
