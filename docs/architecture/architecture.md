## Architecture

### Tech Stack

#### Frontend
- **React.js** 
- **Vite**
- **React Router**

#### Backend
- **Supabase**
- See database structure in `docs/usage/db_structure.png`

#### Testing & Quality 
- **Vitest** 

### Static view

![Component diagram](static-view/component-diagram.png)

- The components are organized into clear architectural layers, which ensures high cohesion within layers and loose coupling between them.


This improves maintainability in terms of the following characteristics:

- **Modularity**: Each module has a well-defined responsibility.
- **Replaceability**: Components on a page can be rearranged or reused independently without affecting other parts of the system, `hooks` and `api` can be reused or replaced without changing the UI.
- **Testability**: Each layer can be tested in isolation.

### Dynamic view

![Sequence Diagram](dynamic-view/sequence-diagram.png)

This sequence diagram illustrates a key scenario in the system: selecting and submitting elective course preferences.

- The user is authorized via the Context and Authorizer.
- Based on the user's role, a request is sent through the DB Connector to retrieve a personalized list of available courses from the Database.
- These courses are then displayed through the Course Form.
- Finally, the user submits their selected course priorities, which are sent back and stored.

This flow involves multiple components across both the frontend and backend layers, including pages, hooks, context, API, and the database.

**Execution time**:  
The complete process, from user authentication through data retrieval and form submission, takes approximately **500–600 ms in total**, measured via separate requests in the browser’s DevTools in a production environment.

This scenario supports the analysis of the following quality attributes:

- **Performance** – responses are received within 0.5–0.6 seconds, meeting user expectations for responsiveness.
- **Reliability** – Supabase consistently returns appropriate status codes (e.g., 200, 201) that confirm successful operations or provide fallback opportunities in case of failure.

### Deployment view

![Deployment Diagram](deployment-view/deployment-view.png)

This diagram presents the deployment architecture of the MakeYourChoice system.

- The **frontend** is built with React (Vite) and deployed to **Vercel**, a static hosting platform with CI/CD.
- The **backend** is powered by **Supabase**, a cloud-based Backend-as-a-Service solution that includes:
    - **Auth Service** for login, signup, and role detection
    - **PostgreSQL Database** for storing courses and user preferences

**Deployment choices:**
- Supabase was selected to offload backend logic, avoid maintaining servers, and ensure scalability.
- Vercel enables fast and reliable global delivery of the frontend with simple deployment workflows.

**Customer-side deployment:**
- No backend server or database setup is needed.
- To deploy the system:
    - Clone the frontend repo
    - Connect it to Vercel
    - Set the required environment variables for Supabase:
      ```env
      VITE_SUPABASE_URL=...
      VITE_SUPABASE_ANON_KEY=...
      ```
