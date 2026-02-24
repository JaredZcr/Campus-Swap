Quick install & run guide (English)

Required versions

1. JDK: 17 
2. Maven: 3.9.x 
3. Node.js: 24 LTS 
4. MySQL: 8.0.x (and Workbench ）



Database setup

1. Create database: db_school_trade
2. Import SQL: backend/DB_School_Trade.sql

Run backend
Go to the backend folder and run:
mvn spring-boot:run
Backend runs on: [http://localhost:8080](http://localhost:8080)

Run frontend
Go to the frontend folder and run:
npm install
npm run dev
Frontend runs on: [http://localhost:5173](http://localhost:5173) (or 5174)

