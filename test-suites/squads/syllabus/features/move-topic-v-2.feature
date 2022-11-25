@cms @teacher @learner
@syllabus @studyplan-book @studyplan

Feature: Move topic v2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "content without quiz" book
        And school admin has created a new course without any location
        And school admin has created a matched studyplan for student

    #TCID:syl-0088,syl-0089
    Scenario Outline: Move topic inside a book
        Given school admin goes to book detail page of the content book
        And school admin selects a topic is not at "<position>"
        When school admin moves topic "<direction>"
        Then school admin sees that topic is moved "<direction>" on CMS
        And school admin is at the "master" study plan detail
        And school admin sees the topic is moved "<direction>" in the master study plan detail
        And school admin is at the "individual" study plan detail
        And school admin sees the topic is moved "<direction>" in the individual study plan detail
        And teacher sees the topic moved "<direction>" in student study plan detail page
        And student sees the topic moved "<direction>" in Course detail screen on Learner App
        Examples:
            | position | direction |
            | top      | up        |
            | bottom   | down      |
