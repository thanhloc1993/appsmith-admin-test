@cms @teacher @learner @teacher2 @learner2
@virtual-classroom
@virtual-classroom-streaming

Feature: Turn off speaker and camera by teacher and student
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student S1, student S2" have joined lesson on Learner App
        And all teachers and students's speaker and camera are "active"

    Scenario Outline: Student can turn off their <function>
        When "student S1" turns off their "<function>" on Learner App
        Then "student S1" sees "inactive" "<function>" mode on Learner App
        And "student S2" sees "active" "<function>" mode on Learner App
        And all teachers see "inactive" "student S1" "<function>" mode on Teacher App
        And all teachers see "active" "student S2" "<function>" mode on Teacher App
        Examples:
            | function |
            | speaker  |
            | camera   |

    Scenario Outline: Teacher can turn off their <function>
        When "teacher T1" turns off their "<function>" on Teacher App
        Then "teacher T1" sees "inactive" "<function>" mode on Teacher App
        And "teacher T2" sees "active" "<function>" mode on Teacher App
        And "teacher T2" sees "inactive" "teacher T1" "<function>" mode on Teacher App
        And all students see "inactive" "teacher T1" "<function>" mode on Learner App
        And all students see "active" "teacher T2" "<function>" mode on Learner App
        Examples:
            | function |
            | speaker  |
            | camera   |

    Scenario Outline: Teacher can turn off individual student's <function>
        When "teacher T1" turns off "student S1" "<function>" on Teacher App
        Then all teachers see "inactive" "student S1" "<function>" mode on Teacher App
        And all teachers see "active" "student S2" "<function>" mode on Teacher App
        And "student S1" sees "inactive" "<function>" mode on Learner App
        And "student S2" sees "active" "<function>" mode on Learner App
        Examples:
            | function |
            | speaker  |
            | camera   |

    Scenario Outline: Teacher can turn off all students's <function>
        When "teacher T1" turns off all students "<function>" on Teacher App
        Then all students see their "<function>" are "inactive" mode on Learner App
        And all teachers see "inactive" students's "<function>" mode on Teacher App
        Examples:
            | function |
            | speaker  |
            | camera   |
