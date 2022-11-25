@cms @teacher @teacher2 @learner @learner2
@virtual-classroom
@virtual-classroom-polling-statistics

# 2 teachers and 2 students with default 4 options
Feature: Teacher can see Stats is changed after student submits answer
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student S1" with course and enrolled status has logged Learner App
        And "student S2" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1" has joined lesson of lesson management on Teacher App
        And "teacher T2" has joined lesson of lesson management on Teacher App
        And "student S1, student S2" have joined lesson on Learner App

    # We will have cases:
    # -Case 1: 2 students submit wrong answer
    # -Case 2: 2 students submit correct answer
    # -Case 3: 1 student submits correct answer and one student submits incorrect answer
    Scenario Outline: Teacher can see Stats is changed after student submits answer
        Given "teacher T1" has opened polling on Teacher App
        And "teacher T1" has set correct answer is "<correctOption>" option
        And "teacher T1" has started polling on Teacher App
        When "student S1" submits "<student1Option>" option on Learner App
        And "student S2" submits "<student2Option>" option on Learner App
        Then "teacher T1, teacher T2" see submission is "2/2"
        And "teacher T1, teacher T2" see accuracy is "<accuracyRate>"
        Examples:
            | correctOption | student1Option | student2Option | accuracyRate |
            | A             | B              | C              | 0.00%        |
            | A             | A              | A              | 100.00%      |
            | A             | A              | 1 of [B,C,D]   | 50.00%       |
            | A             | 1 of [B,C,D]   | A              | 50.00%       |
