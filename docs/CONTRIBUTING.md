## Development

### Kanban board

Board link:(https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/boards)

Column entry criteria:

1. Open:
    - Task has been created with clear description
    - Initial time estimate provided (in points/hours)

2. Backend Needed:
    - Task requires backend implementation
    - Frontend requirements (if any) are documented
    - Task has clear acceptance criteria

3. Frontend Needed:
    - Task requires frontend implementation
    - Task has clear acceptance criteria
    - Responsiveness requirements specified

4. On the Future:
    - Task is not critical for current milestone
    - Requires external approvals/decisions
    - Has lower priority than current tasks

5. Closed:
    - All acceptance criteria are met
    - Code has been reviewed and approved
    - Passed all automated tests
    - Documentation updated (if required)
    - Merged to main branch

The board has been updated to reflect these criteria, with all existing tasks moved to appropriate columns based on their current state and requirements.

### Git workflow
Base workflow: We use a simplified GitHub Flow adapted for academic projects with feature branching and mandatory code reviews.
Define rules for:
1. Creating issues:
    - All issues must be created from Kanban board columns: Open, Backend Needed, Frontend Needed, On the Future, Closed. Also they should follow user story format.
2. Labelling issue:
    - Sprints: MVP1, MVP2, MVP3, MVP4, MVP5
    - Priority: Critical, High, Normal, Low
    - Team: backend needed, frontend needed
    - Size: small, medium, huge
3. Assigning issues:
    - Team lead assigns issues during sprint planning
4. Branch management:
    1. Naming convention: {short-description-type}
        - adding-course-search-backend - for new features (backend)
        - fixing-archive-button-frontend - for bug fixes (frontend)
    2. Creation: always from main branch
    3. Merging: only via approved Merge Requests
    4. Commit messages:
        - type(scope): description (plus comments optionally)
5. Code reviews:
   Review of code and documentation before sending to the main branch and approval from the team lead

![Git Workflow Diagram](docs/development/gitGraph_mermaid.png)

### Secrets Management

We follow secure practices for handling sensitive information like database credentials and API keys:
