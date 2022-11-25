@cms
@cms-syllabus-integration
@syllabus @book

Feature: [Integration] School admin creates a topic

    Background:
        Given "school admin" logins CMS

    #TCID:syl-0053,syl-0005
    Scenario: School admin creates a topic in an empty chapter
        Given school admin has created a "1 empty chapter" book
        And school admin is at book detail page
        When school admin creates a topic "without" avatar in a chapter
        Then school admin sees message "You have added topic successfully"
        And school admin sees a new topic in chapter

    #TCID:syl-0053,syl-0098
    Scenario Outline: School admin creates a topic in a chapter which already has topics
        Given school admin has created a "has chapter and topic only" book
        And school admin is at book detail page
        When school admin creates a topic "<uploadAvatar>" avatar in a chapter
        Then school admin sees message "You have added topic successfully"
        And school admin sees a new topic in chapter

        Examples:
            | uploadAvatar |
            | with         |
            | without      |

    #TCID:syl-0006
    Scenario Outline:  School admin cannot create topic with missing <field>
        Given school admin has created a "has chapter and topic only" book
        And school admin is at book detail page
        When school admin creates a topic with missing "<field>" in a chapter
        Then user cannot create any topic
        Examples:
            | field |
            | name  |
