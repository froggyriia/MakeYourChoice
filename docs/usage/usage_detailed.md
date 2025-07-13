# How to Set Up and Run the Project

## 1. Clone the repository

First, copy the project to your computer by running this command in your terminal:

```
git clone https://gitlab.com/your-username/makeyourchoice.git
cd makeyourchoice
```

## 2. Install the required tools

Make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (Node's package manager)

You can download Node.js from [here](https://nodejs.org/).

## 3. Set up your environment variables

Before running the project, you need to set up a file with special settings (called **environment variables**). Follow these steps:

1. Go to the `frontend/` folder inside your project.
2. Create a file named `.env` inside that folder.
3. Open the `.env` file and add these two lines:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You'll need to replace `your-project` and `your-supabase-anon-key` with the actual values from your Supabase account. If you don't have a Supabase account, sign up at [supabase.io](https://supabase.io/).

## 4. Run the project

Now, you're ready to start the project:

1. Go to the `frontend` folder:
```
cd makeyourchoice/frontend
```

2. Install the project dependencies by running:
```
npm install
```

3. Start the project with this command:
```
npm run dev
```

The app should now be running and accessible at [http://localhost:5173](http://localhost:5173).

## 5. Test Accounts

You can log in with one of these test accounts:

- **Student**  
Email: `t.test@innopolis.university`

- **Admin**  
Email: `admin@innopolis.university`

- **Student / Admin**  
Email: `a.potyomkin@innopolis.university`

## 6. Database Structure

Here is an overview of the database tables you’ll be working with:

![Database structure](db_structure.png)

## 7. Common Pages

Here are the main pages and what they do:

- `/login`: The login screen.
- `/student-catalogue`: Page for students to choose electives.
- `/admin/courses`: Admin view for managing the course catalog.
- `/admin/programs`: Admin view for managing student programs.
- `/admin/semesters`: Admin view for semester adjustments.