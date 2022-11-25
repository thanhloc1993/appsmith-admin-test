@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-join-leave

Feature: Teacher can see active share material and polling icon in lesson waiting room
    Background:
        Given "school admin" logins CMS
        And "teacher T1" logins Teacher App
        And "teacher T2" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached materials on CMS
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Teacher can see active share "<file>" material and polling icon in lesson waiting room
        Given "teacher T1" has shared lesson's "<file>" on Teacher App
        And "teacher T2" has opened polling on Teacher App
        And "teacher T2" has set correct answer is "A" option
        And "teacher T2" has started polling on Teacher App
        When "teacher T1" leaves lesson on Teacher App
        And "teacher T1" goes to lesson waiting room on Teacher App
        Then "teacher T1" sees "active" share material icon in lesson waiting room on Teacher App
        And "teacher T1" sees "active" polling icon in lesson waiting room on Teacher App
        And "teacher T1" sees join button on Teacher App
        Examples:
            | file    |
            | pdf 1   |
            | video 1 |