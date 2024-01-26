# Task Management System

This repository contains a Node.js application for managing tasks and subtasks, including features such as task prioritization, automatic updates of task priorities, and voice call notifications for overdue tasks. The application uses MongoDB as the database and integrates with Twilio for voice call notifications.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Configuration](#configuration)

## Features

1. **Task Management:**
   - Create, update, and delete tasks.
   - Set due dates and priorities for tasks.
   - Track task status (TODO, IN_PROGRESS, DONE).

2. **Subtask Management:**
   - Create, update, and delete subtasks associated with tasks.
   - Subtask status influences the overall status of the parent task.

3. **Task Priority Calculation:**
   - Prioritize tasks based on due dates.
   - Automatic task priority updates using a scheduled job.

4. **Voice Call Notifications:**
   - Notify users of overdue tasks through voice calls.
   - Twilio integration for making voice calls.

5. **User Authentication:**
   - User registration and login.
   - Token-based authentication for secure API access.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/task-management-system.git
    ```

2. Install dependencies:

    ```bash
    cd task-management-system
    npm install
    ```

3. Set up a MongoDB database and configure environment variables. Refer to [Configuration](#configuration) for details.

4. Run the application:

    ```bash
    npm start
    ```

## Usage

The application exposes RESTful APIs for managing tasks and subtasks. Users can register, log in, create tasks, view tasks, update tasks, and delete tasks. Subtasks can also be created, viewed, updated, and deleted. Voice call notifications are automatically triggered for users with overdue tasks.

## Endpoints

### User

- `POST /user/create-user`: Register a new user.
- `POST /user/login`: Authenticate and log in a user.

### Task

- `POST /task/create-task`: Create a new task.
- `GET /task/get-tasks`: Get all tasks for a user.
- `PUT /task/update-task/:taskID`: Update task details.
- `DELETE /task/delete-task/:taskID`: Delete a task.

### Subtask

- `POST /subTask/create-subTask`: Create a new subtask.
- `GET /subTask/getAll-subTask`: Get all subtasks for a user.
- `PUT /subTask/update-subTask/:subTaskID`: Update subtask details.
- `DELETE /subTask/delete-subTask/:subTaskID`: Delete a subtask.

## Configuration

1. **Environment Variables:**
   - Create a `.env` file in the root directory based on the provided `.env.example`.
   - Set MongoDB connection details, Twilio credentials, and a secret key for JWT.

2. **Database Setup:**
   - Set up a MongoDB database and update the connection details in the `.env` file.

3. **Twilio Integration:**
   - Create a Twilio account and obtain SID, Auth Token, and a Twilio phone number.
   - Set these values in the `.env` file.
