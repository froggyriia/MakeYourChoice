# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
## [Unreleased]

### Added
- MVPv.4 **suggested-courses:** suggested courses page for admin
- MVPv.4 **suggested_courses:** functionality of suggesting courses from professors
### Changed
- MVPv.4 **search:** now program is searching for courses dynamically ([85c31ee1](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/commit/85c31ee1187dca37b695198289640ba1915d7975))

## [MVPv.2.5] - 2025-07-06

### Added
- **docs:** templates for pull requests
- **docs:** templates for merge requests
- **docs:** README.md file
- **semesters:** implemented semester handling page with save/edit functionality
- **user's roles:** student view for admins
- **export to excel:** the history of all students' submitted forms now is saved in Excel file

### Changed
- **filtering**: enhanced main functionality with year-based filtering
- **export to excel:** now saves the history of students submitted forms of priorities
- **catalogue of courses:** replaced compact view with table layout

### Fixed
- **design:** rarely used functionality now is hidden 
- **design:** interface for filtering bar

## [MVPv.2.0] - 2025-06-22

### Added

- **filtering:** filtering for the courses
- **filtering:** students' completed courses now cannot be chosen by them in the form
- **archive:** new functionality of archiving courses by admin
- **deadlines:** deadlines for filling the form are now displayed for students
- **catalogue of courses:** compact and full view of catalogue
- **user view:** markdown is added to the course description now

### Changed

- **admin view:** programs and catalogue pages are now separated for admin 
- **export to excel:** excel file now contains legend page for electives abbreviations

### Fixed

- **roles:** admin and student pages are separated (including routes)
- **design:** the header is now fixed and is not moving
- **design:** catalogue of courses and submit form can now be independently scrolled

## [MVPv.1.0] - 2025-06-15

### Added

- **programs:** functionality of adding new academic programs for an admin
- **programs:** functionality of setting different amount of humanitarian and technical electives to each academic program for an admin
- **catalogue of courses:** new functionality of adding, deleting and editing existing courses

