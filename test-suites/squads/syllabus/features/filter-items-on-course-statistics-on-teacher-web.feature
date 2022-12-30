@cms @teacher
@syllabus @course-statistics
@Syllabus_StudyPlan_CourseStatistic

Feature: Teacher filters items on course statistics on teacher web
    Background:
        Given "school admin" logins CMS
        And school admin has created students "student S1,student S2" belong to location
        And school admin has created a "course" belong to "location" and "class C1 & class C2"
        And school admin adds the "course" for "student S1" with "location" and "class C1"
        And school admin adds the "course" for "student S2" with "location" and "class C1"

    #TCID:syl-0620,syl-0621,syl-0622
    Scenario Outline: Teacher sees study plan items when filtering study plan and class with active students
        Given school admin has created a "all learning materials" book "book B1"
        And school admin creates a matched studyplan "study plan SP1" by "book B1" for "course"
        And school admin has created a "all learning materials" book "book B2"
        And school admin creates a matched studyplan "study plan SP2" by "book B2" for "course"
        And "teacher" logins Teacher App
        When teacher is at course statistics screen of "course"
        And teacher filters study plan "<study plan>"
        And teacher filters class "class C1"
        Then teacher sees course statistics study plan items of "<study plan>"

        Examples:
            | study plan     |
            | study plan SP1 |
            | study plan SP2 |

    #TCID:syl-0617,syl-0618,syl-0619
    Scenario Outline: Teacher sees study plan items when filtering study plan and class with no students
        Given school admin has created a "all learning materials" book "book B1"
        And school admin creates a matched studyplan "study plan SP1" by "book B1" for "course"
        And school admin has created a "all learning materials" book "book B2"
        And school admin creates a matched studyplan "study plan SP2" by "book B2" for "course"
        And "teacher" logins Teacher App
        When teacher is at course statistics screen of "course"
        And teacher filters study plan "<study plan>"
        And teacher filters class "class C2"
        Then teacher sees course statistics study plan items of "<study plan>"

        Examples:
            | study plan     |
            | study plan SP1 |
            | study plan SP2 |

    @ignore
    Scenario Outline: Teacher doesn't see study plan items when filtering study plan and filtering no classes
        Given school admin has created a "all learning materials" book "book B1"
        And school admin creates a matched studyplan "study plan SP1" by "book B1" for "course"
        And school admin has created a "all learning materials" book "book B2"
        And school admin creates a matched studyplan "study plan SP2" by "book B2" for "course"
        And "teacher" logins Teacher App
        When teacher is at course statistics screen of "course"
        And teacher filters study plan "<study plan>"
        And teacher filters no classes
        Then teacher sees an empty page on course statistics

        Examples:
            | study plan     |
            | study plan SP1 |
            | study plan SP2 |