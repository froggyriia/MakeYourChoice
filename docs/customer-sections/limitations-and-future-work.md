## Limitations and Future Work

### Current Capabilities

The system currently supports:

✔ **Student voting**  
- Collects preferences for humanities/technical electives  
- Prevents re-voting for already taken courses  
- Restricts voting to relevant year/program electives  

✔ **Admin features**  
- Create/manage courses, programs, and voting periods  
- Approve/reject instructor course proposals  
- Dual-role support (admin-students can vote)  

✔ **Course discovery**  
- Search by title, instructor, or description  
- Time-bound access (only visible during voting periods)  

### Known Limitations

⚠ **Authentication**  
- No SSO integration (currently manual account management)  

⚠ **Functionality gaps**  
- No advanced course categorization (only technical/humanities)  
- Missing favorites system and alumni feedback  
- No deadline notifications for students  

⚠ **Performance concerns**  
- Potential stability issues under heavy load  
- Risk of data loss without proper backups  

### Roadmap

#### Short-term priorities
- [ ] Implement Innopolis SSO authentication  
- [ ] Add deadline reminders (1-hour notice)  
- [ ] Migrate to PostgreSQL with regular backups  

#### Medium-term goals
- [ ] Improve system performance and scalability  
- [ ] Add course favorites functionality  
- [ ] Implement alumni feedback system  

#### Long-term vision
- [ ] Advanced course categorization by professional tracks  
- [ ] Comprehensive analytics dashboard  
- [ ] Mobile-friendly interface  

### Contributing

We welcome community contributions! Please check our:
- [GitLab Issues](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/issues) for open tasks
- Tech debt marked with `TODO/FIXME` comments in code  

> **Note**: This reflects our current development priorities as of {month/year}. For the latest updates, please refer to our project tracker.
> 