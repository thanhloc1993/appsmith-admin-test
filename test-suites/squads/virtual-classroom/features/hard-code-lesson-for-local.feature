@cms @teacher @teacher2 @learner @learner2
@virtual-classroom
@ignore

Feature: Virtual Classroom Local Test
    Background:
        Given "school admin" logins CMS
        And setup scenario context for Local
        And "teacher T1, teacher T2" login Teacher App Local
        And "student S1, student S2" have logged Learner App Local
        And "teacher T1, teacher T2" have joined virtual classroom on Teacher App Local
        And "student S1, student S2" have joined lesson on Learner App Local

    Scenario Outline: Teacher can open polling when teacher shares <material>
        Given "teacher T1" has shared lesson's "<material>" on Teacher App
        Then "student S1" sees "<material>" on Learner App
        Examples:
            | material |
            | pdf 1    |
            | video 1  |