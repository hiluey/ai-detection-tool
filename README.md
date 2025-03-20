While trying to use the provided API, I noticed a mismatch.
The detect API provided the ID, and the query received it, but it remained in a pending state. For small texts, it worked but lacked accuracy. However, for texts with 200 words or even just 10 words, it didn't work at all. The query status remained "pending" even after multiple requests (without changing the ID) and waiting for processing—it never changed.

I conducted numerous tests, but nothing worked. To meet the deadline, I created a simulated detector that provides random detections without a real basis.

## App Access Credentials:
User: user
Password: mudar123!


In the app, it is possible to create new users. To create one, simply sign up, and Supabase will send a link. By clicking on the link, your email will be verified, and you will be able to access the project.


Technologies Used:
Next.js
React
Tailwind CSS
CSS
TypeScript
Supabase
Prisma
Stapri

Project Structure:
The application follows the recommended Next.js structure, with the app folder containing the main pages and components.

Main Application Page:
src\app\detect\page.tsx
src\styles\page.css
Login Page:
src\app\detect\login
src\styles\login.css
Signup Page:
src\app\detect\signup
src\styles\signup.css
History Page:
src\app\detect\history
src\styles\history.css
I also created a settings page, already enabled with Supabase, but since the front-end wasn't ready in time, I didn't add an option for users to access it.

API & Supabase Configurations:
Located in:

src\lib
I didn't use the ai.ts class because the API was supposedly malfunctioning.

How to Run the Application:
Install dependencies:
bash
Copiar código
npm install
Run the development server:
bash
Copiar código
npm run dev


Open in your browser:
http://localhost:3000/detect/login

Deployment:
The application is hosted on Vercel.
