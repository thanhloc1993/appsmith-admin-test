@cms
@cms-syllabus-integration
@syllabus

Feature: [Integration] School admin moves topic inside a book integration

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has 2 topic" book
        And school admin goes to book detail page

    #TCID:syl-0041
    Scenario Outline: School admin moves topic <direction>
        Given school admin selects a topic is not at "<position>"
        When school admin moves topic "<direction>"
        Then school admin sees message "You have moved item successfully"
        And school admin sees that topic is moved "<direction>" on CMS

        Examples:
            | position | direction |
            | top      | up        |
            | bottom   | down      |
