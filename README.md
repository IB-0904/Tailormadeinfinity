# Blog Site Application (Microservice-style Architecture)

This project contains a full-stack Blog Site application built with Spring Boot (Backend) and React JS (Frontend).

## Prerequisites
- **Java 17**
- **PostgreSQL** running on `localhost:5432` with username `postgres` and password `password`. Database name must be `blogdb`.
- **Node.js** (v18+) and **npm**

## Database Setup
1. Open pgAdmin or use the psql CLI.
2. Create a new database named `blogdb`.
   ```sql
   CREATE DATABASE blogdb;
   ```

## Running the Backend (IntelliJ IDEA)
1. Open IntelliJ IDEA.
2. Select **File -> Open...** and choose the `blog-site-backend` folder.
3. Allow IntelliJ to sync the Maven dependencies.
4. Locate `BlogsiteApplication.java` in `src/main/java/com/casestudy/blogsite/`.
5. Right-click on the file and select **Run 'BlogsiteApplication'**.
6. The backend server will start on `http://localhost:8080`.

## Running the Frontend (VS Code)
1. Open Visual Studio Code.
2. Select **File -> Open Folder...** and choose the `blog-site-frontend` folder.
3. Open a new terminal in VS Code.
4. Run the following command to install dependencies:
   `npm install`
5. Run the following command to start the development server:
   `npm run dev`
6. The frontend application will be available at `http://localhost:3000` (or another port outputted in the terminal).

## Architecture Details
- **Backend:** Spring Boot with package-level architecture (controller, model, dto, service, repository, security). Uses Spring Security with Basic Auth. Passwords are encrypted using BCrypt.
- **Frontend:** React JS with Tailwind CSS, React Router DOM, and Axios.
- **Database:** PostgreSQL accessed via Spring Data JPA (Hibernate).
