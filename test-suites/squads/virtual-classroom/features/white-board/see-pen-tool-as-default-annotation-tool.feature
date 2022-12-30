@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-white-board
@ignore

Feature: Teacher and student see pen tool as the default annotation tool
    Background:
        Given "school admin" logins CMS
        And "teacher T1" logins Teacher App
        And "teacher T2" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1" has joined lesson of lesson management on Teacher App
        And "teacher T2" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Other teacher sees pen tool as the default annotation tool
        When "teacher T1" shares lesson's "pdf" on Teacher App
        And "teacher T1" enables white board of "student" on Teacher App
        Then "teacher T1" sees default pen tool icon in white board on Teacher App
        And "teacher T1" sees default line size icon under pen tool icon in white board
        And "teacher T1" sees default green colour icon under line size icon in white board
        And "teacher T2" sees default pen tool icon in white board on Teacher App
        And "teacher T2" sees default line size icon under pen tool icon in white board
        And "teacher T2" sees default green colour icon under line size icon in white board
        And "student" sees default pen tool icon in white board on Learner App
        And "student" sees default line size icon under pen tool icon in white board
        And "student" sees default green colour icon under line size icon in white board
