**The full transcript of customer meeting**


**Question: “Is the product complete?”**

_Customer:_

– I think it is complete, but for now you should finish development and fix bugs.

_Daria, Team Lead:_

– Can we consider Performance Efficiency with Lighthouse (for CI CD) as not necessary for now?

_Customer:_

– I didn’t say that it is necessary

_Daria, Team Lead:_

– So we need to ensure that implemented functions work correctly and don’t pay too much attention to the time efficiency?

_Customer:_

– Currently, yes. But still the goal is to make them work with little or no delays.


**Question: “Is the customer using the product? How often? In what way? If not,
why not?”**

_Customer:_

– Not yet, because the season when I collect electives hasn’t started.


**Question: Has the customer deployed the product on their side?**

_Customer:_

– It means that I should have taken your product by myself, but I haven’t done it. However, this part is very important. *example of previous year students who delivered their product to our customer and he wasted a lot of time trying to deploy it by himself*


**Question: What measures need to be taken to fully transition the product?**

_Customer:_

– Finish working on the product, ensure its reliability, follow user scenarios, and just test it from different aspects. You have different types of tests, right? Do you have interface tests?

_Maria, Backend Developer:_

– We also have special tests that check only the front end.

_Customer:_

– I’m talking about different things. There are helpful tools such as Selenium. As a customer, I would like you to test efficiency by completing user scenarios. For example, you make changes, upload them, and your tests on CI automatically check it.

_Daria, Team Lead:_

– We are going to integrate SSO in our product as soon as the IT department approves our request. Because we haven’t received the answer yet.

_Customer:_

– Ok, I will talk with the IT department about it next week, but you’re not the only team that waits for the response.


**Question: What are the customer’s plans for the product after its delivery? Are they going to continue working on it? Would they like to continue
collaborating with the team and on what conditions?**

_Daria, Team Lead:_

– It seems like conditions should be discussed from both sides. So the first question can be do you even plan to continue working with our team?

_Customer:_

– For now, I like the product you are making and I would continue collaborating with you. But I’m not sure about the conditions, we need to think about them. Are you ready to keep working?

_Daria, Team Lead:_

– It depends on the conditions and time limits.

_Customer:_

– Then let’s suppose that the SWP course has finished and I would like to use your product. Then I would ask you about the time when you will be ready to continue product development.

_Daria, Team Lead:_

– I guess that for the upgoing season (Fall 2025) we wouldn't be ready. But for spring electives voting we can try to. I mean, we can manage to start collecting votes for the fall electives, but only if we will work on the project whole August.

_Customer:_

– Well, I will consider your answer.

_Daria, Team Lead:_

– If you decide to use our project later, would it be mentioned who created it? Because it will be very valuable for our portfolio.

_Customer:_

– Of course yes. Moreover, not only for the portfolio, but also for job interviews. It is a great opportunity for you. Let’s go back to the question itself. Tell me about your condition requirements.

_Team members:_

– It would be much better if we could work not only for appreciating words. Maybe innopoints or money, something that will stimulate our work.

_Customer:_

– Ok, I understand your point of view. Please collect requirements and preferences from all members in one file so that I can understand if we can compose a team.


**Question: How to increase the chance that it’ll be useful after the final delivery?**

_Customer:_

– I thought about the option of collecting suggested courses, maybe I can get them from lecturers using your special form for it. This is a safe operation and helpful for me to later review these electives. Because there was a case when I just lost one suggestion simply because it was difficult to manage this process and people sent electives in different chats and messengers. On the other hand, gathering voting forms from students is another difficult process that should be tested more to ensure system reliability. I can offer you to set up a testing session with some students: give them an opportunity to vote using your product. By doing this, you can get valuable feedback and insights.


**Customer feedback on your README:**


**Question: Is everything clear? What can be improved?**

_Customer:_

– The part with .env installation is not very clear. Can you explain it please? On which system can I use your instructions? I pay attention to this in order not to face the situation I had a year ago with another project. Moreover, I suggest you review the Quality section, because details related to downloading an Excel file are not as crucial as data storage. It would be better to include information about performance efficiency in your Reliability section. Also, recoverability shouldn’t be tested with user testing, check it manually instead. Try scenarios where you crash the container and check how much time it takes for the system to recover after it. Highlighting this, because it is really important to save all students’ votes and not lose them if the system can’t handle a big load.


**Question: Are they able to launch/deploy using your instructions?**

_Customer:_

– Suppose, I do not know anything about the tools you use. If I read your instructions, I have to be able to launch a product following them. For now, it is not clear for me and I am afraid that I would not be able to use your product. Please review your launch section.

_Safina, Full Stack Developer:_

– So you suggest adding more detailed instructions?

_Customer:_

– Yes, at least think about system details. Will your project work on different operating systems? I also suggest you review database tools. As far as I understand, you chose a good option for creating a prototype (web-database), but for the real solution think about different approaches.


**Question: What two other sections the customer would like to be included in the ReadMe?** 

_Customer:_

– It would be good to have explanations about the output file, i.e. about your projects’ results. Because it is not clear for now what I download. Another section is Limitations and Future Work. It is really important to understand what your product can and can not do. Also, you can mention there what features have you excluded from your scope, what is not a part of the project. Moreover, if we assume that your project is open-source, then when outside developers see it, they have to be able to understand the product and make their contributions. For example, you can form your future work as open issues on GitLab.