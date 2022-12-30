@cms @teacher @learner
@virtual-classroom
@virtual-classroom-raise-hand

Feature: Teacher can toggle to open student list and group chat
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status have logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Teacher can open <tab> by toggle <icon> on Teacher App
        When "teacher" opens "<tab>" by "<icon>" in the main bar on Teacher App
        Then "teacher" sees opening "<tab>" in the right side on Teacher App
        Examples:
            | tab          | icon              |
            | student list | student list icon |
            | group chat   | group chat icon   |

    Scenario: Student can open group chat by toggle group chat icon on Learner App
        When "student" opens group chat by group chat icon in the main bar on Learner App
        Then "student" sees opening group chat in the right side on Learner App

    Scenario Outline:  Teacher can hide <tab> by toggle again <icon> on Teacher App
        Given "teacher" has opened "<tab>" by "<icon>" in the main bar on Teacher App
        When "teacher" hides "<tab>" by "<icon>" in the main bar on Teacher App
        Then "teacher" does not see "<tab>" in the right side on Teacher App
        Examples:
            | tab          | icon              |
            | student list | student list icon |
            | group chat   | group chat icon   |

    Scenario: Student can hide group chat by toggle again group chat icon on Learner App
        Given "student" has opened group chat by group chat icon in the main bar on Learner App
        When "student" hides group chat by group chat icon in the main bar on Learner App
        Then "student" does not see group chat in the right side on Learner App

    Scenario Outline: Teacher can switch opening between student list and group chat tab on Teacher App
        Given "teacher" has opened "<tab1>" by "<icon1>" in the main bar on Teacher App
        When "teacher" opens "<tab2>" by "<icon2>" in the main bar on Teacher App
        Then "teacher" sees opening "<tab2>" in the right side on Teacher App
        Examples:
            | tab1         | tab2         | icon1             | icon2             |
            | student list | group chat   | student list icon | group chat icon   |
            | group chat   | student list | group chat icon   | student list icon |

    Scenario Outline: Teacher can hide <tab2> after switching opening between student list and group chat tab on Teacher App
        Given "teacher" has opened "<tab1>" by "<icon1>" in the main bar on Teacher App
        And "teacher" has opened "<tab2>" by "<icon2>" in the main bar on Teacher App
        When "teacher" hides "<tab2>" by "<icon2>" in the main bar on Teacher App
        Then "teacher" does not see "<tab2>" in the right side on Teacher App
        Examples:
            | tab1         | tab2         | icon1             | icon2             |
            | student list | group chat   | student list icon | group chat icon   |
            | group chat   | student list | group chat icon   | student list icon |