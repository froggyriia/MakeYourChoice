# User Acceptance Tests

## Overview
Acceptance criteria are:
- Conditions that a software product must be accepted by a user/customer
- A set of statements with a clear pass/fail results
- Specifies functional & non-functional requirements
- Applicable at the Epic, Feature, & Story Level

---

## Process Flow
1. **Test Selection**  
   - Choose PBIs (Product Backlog Items) from current sprint  
   - Extract test scenarios from Acceptance Criteria  
2. **Execution**  
   - Customer performs tests in production-like environment  
3. **Reporting**  
   - Document passed/failed tests  
   - Log improvement requests  

---

## Test Sessions

### Session 1: Core Functionality
**Date**: 29/06/2025    
**Participants**: Admin (Customer)  
**Link**: [video recording](https://drive.google.com/file/d/1ETyrVrMtAbH_JIK14n7fBm1Kz17nRQBz/view)

#### Tested Features
| Feature | Scenario | Status |
|---------|----------|--------|
| **A. Course Filtering** | Dynamic filter updates without page reset | ✅ Passed |
| **B. UI/UX** | Fixed header, form auto-progress | ✅ Passed |
| **C. Role-Based Access** | Correct redirects for admin/student | ✅ Passed |

**Detailed Scenarios**:

1. FILTERING COURSES

GIVEN
- the course catalog is open,
- a user applies filters

WHEN
- admin selects filter options (language / year / instructor / type / program),
- the backend receives new filter criteria

THEN
- the interface displays only matching courses dynamically.
- it updates results in real-time without resetting previous selections,

2. SITE DESIGN

GIVEN
- a student / admin scrolls through any page,
- a student / admin is filling out an auth/login form

WHEN
- they navigate up or down,
- they press the Enter key

THEN
- the header remains fixed at the top of the viewport,
- the form proceeds next step automatically (without requiring a button click)

3. Create new paths for admin and students
 
GIVEN
- a user logs in as an admin or student,
- a student attempts to access /admin-catalogue

WHEN
- authentication succeeds,
- the request is made

THEN
- they are redirected to /admin-catalogue and /student-catalogue respectively,
- access is denied

**Results of the user testing:**
User testing of 3 specific AC was combined with general use. During the whole meeting, valuable feedback was received. All 3 tests are passed. The customer was satisfied with the interface in general, but suggested some changes:
1. add not only filters, but also "search" option both for admin and students.
2. rename path "admin-catalogue" to "admin" ([Gitlab issue](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/issues/30))
3. change position of filter options so that it is easy to navigate. Add a caption for language filter (specify that it is related to the elective) ([Gitlab issue](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/issues/25))

### Session 2: Search & Voting
**Date**: 29/06/2025    
**Participants**: Admin (Customer)  
**Link**: [video recording](https://drive.google.com/file/d/1pLmJHEOGe5PryAmqKRQWg0dHXSvvQbwr/view?usp=sharing), [audio recording](https://drive.google.com/file/d/1G4DdqumI9G4Z2N0MkSqC4hzjSEGJwgRT/view?usp=sharing)

#### Tested Features
| Feature                 | Scenario                             | Status |
|-------------------------|--------------------------------------|--------|
| **1. Course Search**    | Returns accurate matches             | ✅ Passed |
| **2. Role Switching**   | Seamless admin -> student transition | ✅ Passed |

#### Detailed Scenarios:
1. Searching for courses ([Gitlab issue](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/issues/33))

GIVEN
- user is on the homepage,
- system has courses available

WHEN
- user types a course name / words from its description / instructor’s name in the search bar,
- clicks the "Search" button

THEN
- only matching courses are displayed

2. Admin-Student Submits a Vote ([Gitlab issue](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/issues/35))

GIVEN
- the admin-student is logged in and the voting session is open,
- the admin-student is on admin’s page

WHEN
-  they navigate to the voting page and select their preferred courses,
- they click the button to switch the role

THEN
- the system allows them to submit the vote and displays a confirmation message
- they are redirected to the student’s page (works vice versa, too).

**Results of the user testing**: Both user tests were passed. The customer was satisfied with the interface in general, but suggested some changes:
1. make search dynamical (display results immediately);
2. work on semesters page implementation, change its logic (idea of iterations).
3. switching between roles (admin / student) works well.