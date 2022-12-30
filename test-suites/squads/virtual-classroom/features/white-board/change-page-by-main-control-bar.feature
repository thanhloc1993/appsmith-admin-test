@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-white-board

Feature: Change page by white board bar or main control bar
    Background:
        Given "school admin" logins CMS
        And "student S1" with course and enrolled status has logged Learner App
        And "teacher T1, teacher T2" login Teacher App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student S1" has joined lesson on Learner App
        And "teacher" has shared pdf on Teacher App

    Scenario Outline: Teacher can go to <page> of sharing pdf by main control bar
        When "teacher T1" goes to "<page>" by main control bar on Teacher App
        Then "teacher T1" sees "<page>" of sharing pdf on Teacher App
        And "teacher T2" sees "<page>" of sharing pdf on Teacher App
        And "student S1" sees "<page>" of sharing pdf on Learner App
        Examples:
            | page              |
            | the next page     |
            | the previous page |