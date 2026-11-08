# Backend Development Fundamentals - Lab 01

## 📋 Student Information

| Field | Details |
|---|---|
| Name | T Alveera Afnaan |
| Registration Number | 252U1R1237 |
| Section | CSE-2E 211 |
| Course | Backend Development Fundamentals |
| Faculty | Mr Yugandhar Gurjalwar |
| College | Aurora Deemed-to-be-University |

## 🎯 Objective

To set up a Node.js project and develop a web server using both the built-in HTTP module and Express.js. The server handles multiple routes, returns appropriate responses, and demonstrates basic HTTP status code handling.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime environment for server-side programming |
| Express.js | Web framework for creating web servers and handling routes |
| npm | Package manager for installing dependencies |
| Git | Version control system |
| GitHub | Repository hosting and project management |
| Render | Cloud platform for deploying the application |

## 📦 Understanding package.json

The `package.json` file contains the configuration and metadata of a Node.js project.

| Field | Description |
|---|---|
| name | Name of the project |
| version | Current project version |
| description | Short description of the project |
| main | Entry point of the application |
| scripts | Commands used to run the application |
| keywords | Keywords related to the project |
| author | Project creator |
| license | License type |
| dependencies | Packages required to run the application |

## ⚙️ Installation & Setup

### Prerequisites

- Node.js
- npm
- Git
- Visual Studio Code

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/alveeraafnaan/Backend-lab-reports-.git
```

**2. Navigate to Lab 01**

```bash
cd Backend-lab-reports-/lab\ 01
```

**3. Install dependencies**

```bash
npm install
```

**4. Run the Express server**

```bash
npm start
```

**5. Open the application**

Visit the following URLs in your browser:

- Home: http://localhost:3000/
- About: http://localhost:3000/about
- Time: http://localhost:3000/time
- Error: http://localhost:3000/unknown

## 🖥️ Server Explanations

### 1. Plain Node.js HTTP Server

The built-in Node.js HTTP module allows us to create a server without installing external packages.

The HTTP server:

- Uses `http.createServer()` to create a server.
- Handles incoming requests and responses.
- Returns appropriate responses based on the requested URL.
- Listens on port 3000.

To run the HTTP server:

```bash
node http-server.js
```

### 2. Express.js Server

Express.js simplifies server development by providing a clean and structured way to handle HTTP requests.

The Express server:

- Uses `express()` to create the application.
- Defines routes using `app.get()`.
- Handles JSON responses.
- Uses middleware for handling unknown routes.
- Listens on port 3000.

To run the Express server:

```bash
npm start
```

## 📡 API Endpoints

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| GET | `/` | Returns the welcome message | 200 OK |
| GET | `/about` | Returns student and lab information | 200 OK |
| GET | `/time` | Returns the current server date and time | 200 OK |
| GET | `/unknown` | Returns an error for undefined routes | 404 Not Found |

### Example Responses

#### GET /

```json
{
  "message": "Welcome to the Backend Development Fundamentals Lab 1!",
  "student": "T Alveera Afnaan",
  "lab": "Lab 1 - Node.js and Express Server"
}
```

#### GET /about

```json
{
  "name": "T Alveera Afnaan",
  "registrationNumber": "252U1R1237",
  "section": "CSE-2E 211",
  "course": "Backend Development Fundamentals",
  "college": "Aurora Deemed-to-be-University"
}
```

#### GET /time

```json
{
  "currentDateTime": "Current server date and time",
  "isoFormat": "Current date and time in ISO format",
  "message": "This is the current server date and time."
}
```

#### GET /unknown

```json
{
  "error": "Route not found",
  "message": "The requested route does not exist on this server.",
  "statusCode": 404
}
```

## 📸 Screenshots

The following screenshots demonstrate the working of the application.

### 1. Home Endpoint - GET /

![Home Endpoint](./screenshots/lab%2001%20home.png)

### 2. About Endpoint - GET /about

![About Endpoint](./screenshots/lab%2001%20about.png)

### 3. Time Endpoint - GET /time

![Time Endpoint](./screenshots/lab%2001%20time.png)

### 4. 404 Error Endpoint - GET /unknown

![404 Error Endpoint](./screenshots/lab%2001%20Error.png)

## 🚀 Deployment on Render

The application can be deployed using Render.

### Deployment Steps

1. Sign in to Render using your GitHub account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Configure the service.

| Setting | Value |
|---|---|
| Name | alveera-lab01 |
| Root Directory | `lab 01` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |

5. Click **Deploy Web Service**.
6. Wait for the deployment to complete.
7. Open the generated deployment URL and test the endpoints.

### Live Deployment URL

**Deployment URL:** To be added after deployment.

Once deployed, the endpoints can be accessed using:

- Home: `YOUR_RENDER_URL/`
- About: `YOUR_RENDER_URL/about`
- Time: `YOUR_RENDER_URL/time`
- Error: `YOUR_RENDER_URL/unknown`

## ❗ Problems Faced and Solutions

| Problem | Solution |
|---|---|
| npm command not found | Installed Node.js, which includes npm |
| Cannot find module 'express' | Installed Express using `npm install express` |
| Port already in use | Stopped the existing server or used another port |
| 404 error not working | Added the 404 middleware after all route definitions |
| Server not starting | Checked the code and verified the correct directory |
| Screenshot not displaying on GitHub | Verified the screenshot filename and relative path |

## ✅ Conclusion

In this lab, I learned how to create a basic web server using Node.js and Express.js.

I gained practical experience in:

- Creating an HTTP server using the built-in Node.js HTTP module.
- Installing and managing dependencies using npm.
- Creating routes using Express.js.
- Returning text and JSON responses.
- Handling undefined routes using 404 status codes.
- Understanding the structure of `package.json`.
- Capturing and adding screenshots to a GitHub repository.
- Documenting a backend development project using Markdown.
- Understanding the basics of cloud deployment using Render.

This lab provided a strong foundation in backend development and helped me understand how web servers handle client requests and return responses.

## 👤 Author

**T Alveera Afnaan**

Registration Number: 252U1R1237

Section: CSE-2E 211

Course: Backend Development Fundamentals

College: Aurora Deemed-to-be-University
