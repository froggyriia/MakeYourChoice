<!-- markdownlint-disable MD033 -->
<!-- Enable Mermaid.js rendering -->


# <img src="docs/myc_logo_transparent.svg" alt="Logo" width="40" style="vertical-align: middle;"/> MakeYourChoice


A simple web app for students to choose and submit elective course preferences, with role-based access for admins.

🌐 [Live App](https://make-your-choice.vercel.app/)  
🎥 [Demo Video](https://drive.google.com/file/d/15fmvGx6-0NcezkjH8Lm0wCJ3hUvLieED/view?usp=drive_link) 

## Table of Contents

- [Project Goals](#project-goals-and-description)
- [Context Diagram](#project-context-diagram)
- [Feature Roadmap](#feature-roadmap)
- [Usage](#usage-instructions)
- [Installation](#installation--deployment-instructions)
- [Documentation](#documentation)


## Project Goal(s) and Description

MakeYourChoice is a lightweight web app designed to help students submit their ranked preferences for elective courses.  
Admins can configure course offerings and monitor student submissions.  
The system supports authentication and role-based behavior, with a responsive UI and Supabase backend.

---

##  Project Context Diagram

![Context Diagram](docs/context.png)

This diagram shows how the key stakeholders (students and admins) interact with the application and the Supabase backend.  
The frontend serves as the interface for user interaction, while Supabase handles authentication and data storage.

---

## Feature Roadmap

- [x] Student login via Supabase
- [x] Role-based access (student/admin)
- [x] Course selection and preference form
- [x] Admin course configuration
- [x] Export admin view
- [ ] CSV download for admins
- [ ] Notifications or reminders

---

##  Usage Instructions

1. Visit [the app](https://make-your-choice.vercel.app/)
2. Log in with one of these emails:
  - If you're a student – use `t.test@innopolis.university email`, choose and submit course preferences
  - If you're an admin – use `admin@innopolis.university email`, view and configure available courses
  - If you're an admin and the same time you're a student – use `a.potyomkin@innopolis.university` email

---

## Installation & Deployment Instructions

More detailed usage description is available by [link](docs/usage/usage_detailed.md)

### How to Run Locally

Follow these steps to set up and run the project on your local machine:

1. **Clone the repository**

Start by cloning the project repository to your local machine. Open a terminal window and run the following command:
```
git clone https://gitlab.com/your-org/makeyourchoice.git
```

This will create a folder called `makeyourchoice` on your machine. Change into that folder by running:

```bash
cd makeyourchoice
```

2. **Install the necessary dependencies**

Now, go to the `frontend` directory, where the frontend part of the project is located:

```
cd frontend
```

You need to install all the required dependencies for the project. To do that, run:

 ```
npm install
```
This will download and install all the packages defined in the `package.json` file for the project.

3. **Set up the environment variables**

You need to create an environment file to store sensitive information like your Supabase URL and anonymous key. This is required for connecting the frontend to your Supabase instance.

In the `frontend` directory, you'll find a file named `.env.example`. Copy this file to `.env` using the following command:

```
cp .env.example .env # for MacOS and Linux

copy .env.example .env # for Windows
```

After copying the file, open the `.env` file with your favorite text editor:

```
nano .env  # or use your preferred editor
```

You need to replace the placeholders in the `.env` file with your actual Supabase URL and anonymous key. It will look something like this:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

To get these values, go to [Supabase](https://supabase.io/), log in, and find the URL and the anon key in our project settings.

4. **Start the development server**

Now that everything is set up, you can start the project locally. In the same terminal window, run the following command to start the development server:

```
npm run dev
```

This will start the project and it should be available at `http://localhost:5173` in your browser. If everything is working correctly, you should see the app running locally.

---

That’s it! You have successfully set up and run the project locally on your machine.

### How to Deploy on Vercel

Follow these steps to deploy the project on **Vercel**:

#### 1. Push the project to GitLab

To deploy your project on Vercel, the first step is to push the project to a GitLab repository.

- If you haven't already created a GitLab repository for your project, go to [GitLab](https://gitlab.com) and create a new repository.
- Once the repository is created, push your local project to GitLab by running these commands in your terminal:

```bash
git init  # If you haven't initialized the repo yet
git remote add origin https://gitlab.com/your-username/your-repository.git
git add .
git commit -m "Initial commit"
git push -u origin master
```

Make sure to replace `your-username` and `your-repository` with your actual GitLab username and repository name.

#### 2. Connect the repository to Vercel

Now that your project is on GitLab, you can link it to Vercel:

1. Go to the [Vercel website](https://vercel.com/) and log in or sign up if you haven't already.
2. Click on the **New Project** button.
3. Choose **GitLab** as the source for your project.
4. Vercel will ask for permission to access your GitLab repositories. If prompted, grant access.
5. Select the GitLab repository that you just pushed the project to.
6. Click **Import** to start the setup.

Vercel will automatically detect the correct settings for your project, such as the build command and output directory. You can leave these as default unless you need to make any changes.

#### 3. Add Environment Variables in the Vercel Dashboard

In order to connect your frontend with Supabase, you need to add the necessary environment variables to the Vercel dashboard.

1. In the Vercel dashboard, navigate to your project’s settings.

2. Under the **Environment Variables** section, click **Add** to add new environment variables.

3. Add the following environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

* Replace `your-project` with the name of your Supabase project.
* Replace `your-anon-key` with your Supabase project's anon key.

4. After adding the environment variables, click **Save** to apply the changes.

#### 4. Deploy the Project

Once the repository is connected and the environment variables are set up, Vercel will automatically start building and deploying your project.

* The deployment process should begin immediately after the configuration.
* Once the deployment is completed, Vercel will provide a URL where your project is live. You can find this URL on the **Dashboard** page for your project on Vercel.

#### 5. Verify the Deployment

After Vercel finishes deploying your project, you can verify it by visiting the provided URL. Make sure the app is working as expected and that the connection to Supabase is functioning correctly.

---

That's it! You've successfully deployed your project on Vercel.

## Documentation
- [Development](docs/CONTRIBUTING.md)
- [Quality characteristics and quality attribute scenarios](docs/quality-attributes/quality-attribute-scenarios.md)
- Automated tests
- User acceptance tests
- [Continuous Integration](docs/automation/continuous-integration.md)
- [Architecture](docs/architecture/architecture.md)

## License

This project is licensed under the [MIT License](LICENSE).