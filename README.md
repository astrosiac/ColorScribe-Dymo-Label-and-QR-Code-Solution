# Zia Materials Project

This project is a web application for creating custom color mixtures for paint jobs. Users can input job details, upload a color image, and select formulas with their respective quantities. The application generates a QR code for the job, creates a label with the QR code, and adds the job to a Notion database.

## Features

- Web form to input job details and upload a color image
- Automatic QR code generation for each job
- Custom label creation with the QR code
- Integration with Notion API to add job details to a Notion database

## Installation

1. Clone the repository:
   https://github.com/astrosiac/DymoQRcodePrinter

2. Navigate to the project folder:
   cd DymoQRcodePrinter

3. Install the required dependencies:
   npm install

4. Create a `.env` file in the root directory of the project with the following environment variables:

NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
PORT=3000

Replace `your_notion_api_key` and `your_notion_database_id` with your actual Notion API key and database ID, respectively.

5. Run the development server:

npm start

6. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

1. Fill out the form with the customer, job, color name, address, date, finish, and texture information.
2. Upload a color image.
3. Select the formulas to be used and input their quantities.
4. Click "Submit" to generate a QR code, create a label, and add the job to the Notion database.

## Tech Stack

- Node.js
- Express.js
- Notion API
- Multer (for handling file uploads)
- QR Code generation library

## Contributing

If you'd like to contribute to this project, please create a fork and submit a pull request with your proposed changes.

## License

This project is licensed under the MIT License.
