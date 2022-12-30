@cms
@cms-syllabus-integration
@syllabus @book

Feature: [Integration] Edit topic integration test

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has chapter and topic only" book
        And school admin is at book detail page

    Scenario Outline:  School admin edits topic and <uploadAvatar> avatar
        Given school admin selects a topic in book to edit
        When school admin edits topic "<uploadAvatar>" avatar in a chapter
        Then school admin sees the edited topic in book

        Examples:
            | uploadAvatar |
            | with         |
            | without      |

    Scenario Outline:  School admin cannot edit topic with missing <field>
        Given school admin selects a topic in book to edit
        When school admin edits topic with missing "<field>"
        Then school admin cannot edit topic
        Examples:
            | field |
            | name  |
