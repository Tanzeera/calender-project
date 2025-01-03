
# Communication Management App

This project is a **Communication Management System** designed for administrators and users to manage companies, communication methods, and communication scheduling. It provides a comprehensive interface for both admin users (for managing companies and communication methods) and end-users (for tracking communication tasks and scheduling). This app is built using React and provides a smooth and interactive UI for managing and performing tasks.

## Deployed Version

The app is deployed on Netlify. You can access the live version at: [Communication Management App](https://calender-application-new.netlify.app)

Admin Login - https://calender-application-new.netlify.app/admin-login

## Login Details

- **Admin Login**: 
  - Username: `admin`
  - Password: `admin123`

- **User Login**: 
  - Username: `user@example.com`
  - Password: `password123`

---

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). 

### Prerequisites

- **Node.js** and **npm** should be installed on your system. You can check if they are installed by running:
  ```bash
  node -v
  npm -v
  ```
  If not, you can download and install them from [here](https://nodejs.org/).

### Installing

1. Clone the repository:
   ```bash
   git clone https://github.com/Tanzeera/calender-project.git
   cd calender-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

In the project directory, you can run the following commands:

#### `npm start`

Runs the app in the development mode.Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.Your app is ready to be deployed!

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them.

---

## Project Structure

The app is organized into the following directories:

- **/src**: Contains the main React app and its components.
  - **/components**: Contains the UI components like login, dashboard, and others.
  - **/Admin**: Admin-related modules like communication method management and company management.
  - **/User**: User-related modules like dashboard, calendar view, and notifications.

### Admin Module

The Admin module allows administrators to configure the application and manage its foundational data.

#### Company Management

Admins can add, edit, and delete companies. Each company entry includes:
- Name
- Location
- LinkedIn Profile
- Emails
- Phone Numbers
- Comments
- Communication Periodicity (default communication interval)

#### Communication Method Management

Admins define available communication methods in the system. Each method includes:
- Name (e.g., "Visit" or "LinkedIn Post")
- Description
- Sequence (order of communication)
- Mandatory Flag (whether the method is mandatory in the sequence)

### User Module

The User module is the primary interface for end-users, enabling them to view, manage, and perform communication tasks.

#### Dashboard

The dashboard provides a grid view where each row represents a company, and the columns include:
- Company Name
- Last Five Communications
- Next Scheduled Communication

#### Communication Action

Users can log a new communication by selecting one or multiple companies. The modal allows them to:
- Choose Communication Type (e.g., LinkedIn Post, Email)
- Input Date of Communication
- Add Notes about the communication

Upon submission, the highlights (Red or Yellow) are reset for the selected company/companies.

#### Notifications

A dedicated section that lists overdue and due communications:
- Overdue Communications
- Today's Communications

#### Calendar View

A calendar interface that allows users to:
- View Past Communications
- Manage Upcoming Communications

---

## Running the App Locally

To run the app locally, follow these steps:

1. Clone the repository and install dependencies.
2. Run the app with `npm start`.
3. Open [http://localhost:3000](http://localhost:3000) to access the app in your browser.

---

## Additional Information

For any additional help or to learn more, check out the following resources:

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
  
---

**Note**: For deployment, follow the official documentation on [Netlify](https://www.netlify.com/docs/).
