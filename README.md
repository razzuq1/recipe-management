//used ".gitignore" with the help of W3 schools.
As it ensures repo stays clean, secure, and portable.

Let me explain how the task flow is ,
1.Frontend where i used index.html.Here the user opens page and UI loads and js runs and called the backend API
2.Backend wwhich is named as server.js this receives API request for matching recipes and returns JSON
3.Database named as setup.sql and also recipes.json these both as datas and tables created and formatted , returns rows to server and server transforms them and adds pagination and formatting
4.Frontend again receives JSON and builds table rows dynamically and if clicked a recipe it opens drawer with details and nutritoin

Below is the image of the webpage as soon as user enters:
<img width="1900" height="911" alt="image" src="https://github.com/user-attachments/assets/c2d54c98-9b32-4b12-b480-079374c23ca7" />

Features
- Parse and store recipes from JSON into PostgreSQL
- REST APIs for listing and searching recipes
- Filters by **title, cuisine, rating, total time, calories**
- Pagination support
- Indexed DB queries for performance
- Sample frontend for quick testing
Setup Instructions
 1. Prerequisites
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

