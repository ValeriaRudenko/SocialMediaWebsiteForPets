# Social media website for pets

[![CI/CD](https://github.com/SyTW2324/E14/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/SyTW2324/E14/actions/workflows/main.yml)

## Web systems and technologies

#### Authors

- Oleh Petrov (alu0101688916@ull.edu.es)
- Valeriia Rudenko (alu0101688923@ull.edu.es)

# How to run

1. Install MongoDB:
   If MongoDB is not already installed on your system, download and install it from the official MongoDB website: MongoDB Download
2. Install Node.js Packages:
3. Navigate to the project's root directory using the terminal or command prompt and execute the following commands to install the necessary Node.js packages:
   npm install
4. Populate the Database:
5. Run the script filldatabase.js to populate the MongoDB database with initial data:
   node ./filldatabase.js
6. Install Frontend Dependencies:
   Change directory to the 'frontend' folder:
   cd frontend
   Install frontend dependencies:
   npm install
   Install Backend Dependencies:
   Change directory to the 'backend' folder:
   cd ../backend
   Install backend dependencies:
   npm install
7. Start the Frontend Server:
   While still in the 'frontend' folder, start the frontend development server:
   npm start
8. Start the Backend Server:
   Switch back to the 'backend' folder and start the backend server:
   cd ../backend
   npm start
