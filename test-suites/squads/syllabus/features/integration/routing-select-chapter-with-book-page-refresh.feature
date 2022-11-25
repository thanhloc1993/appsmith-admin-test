@cms @learner
@syllabus @routing
# TODO: @tra vo remove tag staging when book learning progress feature is on uat

Feature: Routing and refresh for Select chapter with book screen On Learner Web

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a content book B1
        And school admin has created a matched studyplan P1 for student

    #TCID:None
    Scenario: Student can access "Book Detail Screen" when entering right Url
        Given student is on "Home Screen"
        And student is on "Learning Page"
        When student goes to Book Detail Screen by using browser address
        Then student is on "Book Detail Screen"
        And student sees books, chapters, topics of book "B1" in Book Detail Screen

    #TCID:None
    @ignore
    Scenario: Student can access "Book Detail Screen" when entering right Url when course have 2 books
        Given school admin has created content book B3
        And school admin has created a matched studyplan P3 for student in the same course
        And student is on "Home Screen"
        And student is on "Learning Page"
        When student goes to Book Detail Screen by using browser address
        Then student is on "Book Detail Screen"
        And student sees books, chapters, topics of book "B1" in Book Detail Screen
        And student doesn't see books, chapters, topics of book "B3" in Book Detail Screen

    #TCID:None
    Scenario: Student refreshes "Book Detail Screen"
        Given student goes to Book Detail Screen
        When student refreshes their browser
        Then student is on "Book Detail Screen"
        And student sees books, chapters, topics of book "B1" in Book Detail Screen

    #TCID:None
    @ignore
    Scenario Outline: Student refreshes "Book Detail Screen" when course have 2 books
        Given school admin has created content book B3
        And school admin has created a matched studyplan P3 for student in the same course
        And student goes to Book Detail Screen
        And student selects book "<book>"
        When student refreshes their browser
        Then student is on "Book Detail Screen"
        And student sees books, chapters, topics of book "B1" in Book Detail Screen
        And student doesn't see books, chapters, topics of book "B3" in Book Detail Screen

        Examples:
            | book |
            | B1   |
            | B3   |

    #TCID:None
    Scenario: Student can go back to "Learning Page" from "Book Detail Screen"
        Given student goes to Book Detail Screen
        When student taps back on browser tab bar
        Then student is on "Learning Page"

    #TCID:None
    Scenario Outline: Student can go back to "Learning Page" from "Book Detail Screen" when course have 2 books
        Given school admin has created content book B3
        And school admin has created a matched studyplan P3 for student in the same course
        And student goes to Book Detail Screen
        And student selects book "<book>"
        When student taps back on browser tab bar
        Then student is on "Learning Page"

        Examples:
            | book |
            | B1   |
            | B3   |

    #TCID:None
    #Wrong param = Wrong course id in URL
    Scenario: Student can access "Book Detail Screen" by entering wrong param on URL and can't see anything
        Given school admin has created content book B3
        And school admin has created a matched studyplan P3 for student in the same course
        And student is on "Home Screen"
        And student is on "Learning Page"
        When student goes to Book Detail Screen by using wrong param in browser address
        Then student is on "Book Detail Screen"
        And student doesn't see books, chapters, topics of book "B1" in Book Detail Screen
        And student doesn't see books, chapters, topics of book "B3" in Book Detail Screen

    #TCID:None
    Scenario: Student can go back to home screen from an empty "Book Detail Screen"
        Given student goes to Book Detail Screen by using wrong param in browser address
        When student taps back on browser tab bar
        Then student is on "Learning Page"