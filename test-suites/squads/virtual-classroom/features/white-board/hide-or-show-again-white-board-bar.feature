@cms @teacher @learner
@virtual-classroom
@virtual-classroom-white-board

Feature: Teacher and student can hide or show again a white board bar
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher" has shared pdf on Teacher App

    Scenario Outline: Teacher can hide white board bar on Teacher App
        Given "teacher" has enabled white board of "student" on Teacher App
        When "teacher" hides white board bar by "<option>" on Teacher App
        Then "teacher" does not see white board bar on Teacher App
        And "teacher" still sees white board icon on Teacher App
        And "student" still sees white board bar on Learner App
        And "student" still sees white board icon on Learner App
        Examples:
            | option                      |
            | icon in action bar          |
            | X button in white board bar |

    Scenario Outline: Student can hide white board bar on Learner App
        Given "teacher" has enabled white board of "student" on Teacher App
        When "student" hides white board bar by "<option>" on Learner App
        Then "student" does not see white board bar on Learner App
        And "student" still sees white board icon on Learner App
        And "teacher" still sees white board bar on Teacher App
        And "teacher" sees white board icon on Teacher App
        Examples:
            | option                      |
            | icon in action bar          |
            | X button in white board bar |

    Scenario Outline: Teacher can show again white board bar on Teacher App
        Given "teacher" has enabled white board of "student" on Teacher App
        And "teacher" has hidden white board bar by "<option>" on Teacher App
        When "teacher" shows again white board bar on Teacher App
        Then "teacher" sees white board bar on Teacher App
        And "teacher" sees white board icon on Teacher App
        And "student" still sees white board bar on Learner App
        And "student" still sees white board icon on Learner App
        Examples:
            | option                      |
            | icon in action bar          |
            | X button in white board bar |

    Scenario Outline: Student can show again white board bar on Learner App
        Given "teacher" has enabled white board of "student" on Teacher App
        And "student" has hidden white board bar by "<option>" on Learner App
        When "student" shows again white board bar on Learner App
        Then "student" sees white board bar on Learner App
        And "student" still sees white board icon on Learner App
        And "teacher" still sees white board bar on Teacher App
        And "teacher" still sees white board icon on Teacher App
        Examples:
            | option                      |
            | icon in action bar          |
            | X button in white board bar |
