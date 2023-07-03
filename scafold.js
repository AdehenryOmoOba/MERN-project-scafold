const { execSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function createDirectory(path) {
  if (!fs.existsSync(path)) {
    // Create the directory
    fs.mkdirSync(path, { recursive: true });
    console.log(`Directory created: ${path}`);
  }
}

const appJSXFile = fs.readFileSync("./contents/appjsx.txt");
const appCSSFile = fs.readFileSync("./contents/appcss.txt");
const indexCSSFile = fs.readFileSync("./contents/indexcss.txt");
const expressPkgJSON = fs.readFileSync("./contents/expressPkgJSON.txt");
const mongoosePkgJSON = fs.readFileSync("./contents/mongoosePkgJSON.txt");
const serverJS = fs.readFileSync("./contents/serverjs.txt");
const mongooseSchema = fs.readFileSync("./contents/mongooseSchema.txt");
const dotenv = fs.readFileSync("./contents/dotenv.txt");

function createReactApp(projectPath) {
  console.log(`Creating a new React app at ${projectPath}...`);

  try {
    //Create client directory
    createDirectory(projectPath);

    // Change directory to the specified project path
    process.chdir(projectPath);

    // Create the React app using npx create-react-app command
    console.log(
      `Executing "create react app" command in ${path.join(
        projectPath
      )} directory...`
    );
    execSync("npx create-vite@latest ./ --template react ./", {
      stdio: "inherit",
    });

    console.log("React app created successfully!");

    // Install Tailwind CSS and its dependencies
    console.log(
      `Executing "npm install tailwindcss postcss autoprefixer" command in ${path.join(
        projectPath
      )} directory...`
    );
    execSync("npm install -D tailwindcss postcss autoprefixer", {
      stdio: "inherit",
    });

    // Create PostCSS configuration file
    console.log(
      `Creating 'postcss.config.js' file in ${path.join(projectPath)} directory`
    );
    fs.writeFileSync(
      path.join(projectPath, "postcss.config.js"),
      `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`
    );

    console.log(
      `Creating 'tailwind.config.js' file in ${path.join(
        projectPath
      )} directory`
    );
    // Create TailwindCSS configuration file
    fs.writeFileSync(
      path.join(projectPath, "tailwind.config.js"),
      `export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
    );

    createDirectory(projectPath + "/src");

    fs.writeFile(projectPath + "/src/app.jsx", appJSXFile, (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
        return;
      }
      console.log('Updated "App.jsx" file.');
    });

    fs.writeFile(projectPath + "/src/app.css", appCSSFile, (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
        return;
      }
      console.log('Updated "App.css" file.');
    });

    fs.writeFile(projectPath + "/src/index.css", indexCSSFile, (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
        return;
      }
      console.log('Updated tailwind declarations in "index.css" file.');
    });

    console.log("Tailwind CSS installed and configured successfully!");
  } catch (error) {
    console.error("Error creating React app:", error);
  }
}

function createExpressApp(projectPath) {
  console.log(`Creating a new expressJS app in ${projectPath} directory...`);

  try {
    //Create server directory
    createDirectory(projectPath);

    // Change directory to the specified project path
    process.chdir(projectPath);

    // Create the Express app
    console.log(`Installing expressJS in ${projectPath} directory...`);
    execSync("npm install express", { stdio: "inherit" });

    execSync("npm install dotenv", { stdio: "inherit" });

    fs.writeFileSync("server.js", serverJS);

    fs.writeFileSync(".env", serverJS);

    // Create a .gitignore file in the server directory
    fs.writeFileSync(".gitignore", `.env\nnode_modules`);

    // Update package.json file to type "module"
    fs.writeFileSync("package.json", expressPkgJSON);

    console.log("Express app created successfully!");
  } catch (error) {
    console.error("Error creating Express app:", error);
  }
}

function createDB(projectPath) {
  console.log(`Creating a new database project at ${projectPath}...`);

  try {
    // Create db directory
    createDirectory(projectPath);

    // Change directory to the db directory
    process.chdir(projectPath);

    // Install Mongoose
    console.log(`Installing mongoose in ${projectPath} directory...`);
    execSync("npm install mongoose", { stdio: "inherit" });

    // Create a mongooseSchema.js file in the db directory
    fs.writeFileSync("mongooseSchema.js", mongooseSchema);

    fs.writeFileSync("package.json", mongoosePkgJSON);

    console.log("Database project created successfully!");
  } catch (error) {
    console.error("Error creating database project:", error);
  }
}

function promptUser() {
  rl.question("Enter project directory path >>> ", (projectPath) => {
    console.log({ projectPath });

    const clientPath = path.join(projectPath, "client");
    const serverPath = path.join(projectPath, "server");
    const dbPath = path.join(projectPath, "db");

    createReactApp(clientPath);
    createExpressApp(serverPath);
    createDB(dbPath);

    rl.close();

    console.log("MERN scafold done ✅");
  });
}

promptUser();
