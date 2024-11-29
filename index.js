#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Helper to execute shell commands
const runCommand = (command) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Failed to execute: ${command}`);
    process.exit(1);
  }
};

// Tailwind CSS setup logic
const setupTailwind = () => {
  console.log("Installing Tailwind CSS and dependencies...");
  runCommand("npm install -D tailwindcss postcss autoprefixer");
  runCommand("npx tailwindcss init -p");

  // Configure `tailwind.config.js`
  const tailwindConfigPath = path.resolve("tailwind.config.js");
  const tailwindConfigContent = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  ],
  plugins: [],
};
  `;
  fs.writeFileSync(tailwindConfigPath, tailwindConfigContent.trim());
  console.log("Updated `tailwind.config.js` with template paths.");

  // Add Tailwind directives to `src/index.css` (overwrite mode)
  const cssFilePath = path.resolve("src", "index.css");
  const tailwindDirectives = `
@tailwind base;
@tailwind components;
@tailwind utilities;
  `;
  if (!fs.existsSync(cssFilePath)) {
    console.log("Creating a new `src/index.css` file...");
  } else {
    console.log("Overwriting the existing `src/index.css` file...");
  }
  fs.writeFileSync(cssFilePath, tailwindDirectives.trim());
  console.log(
    "Added Tailwind directives to `src/index.css`, replacing existing content."
  );

  console.log("Tailwind CSS setup/update complete!");
};

// Execute setup if the script is run directly
if (require.main === module) {
  setupTailwind();
}

// Export the function for programmatic usage
module.exports = setupTailwind;
