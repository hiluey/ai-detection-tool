
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
