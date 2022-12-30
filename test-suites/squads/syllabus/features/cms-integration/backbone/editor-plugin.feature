@cms
@syllabus
@cms-syllabus-integration
@question

Feature: [Integration] Test editor plugin

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has 1 learning objective" book
        And school admin goes to book detail page
        And school admin goes to create question v2 page

    Scenario Outline: Editor uploads a <mediaType> into editor
        When school admin uploads a "<mediaType>" into editor
        Then school admin sees that "<mediaType>" in editor

        Examples:
            | mediaType |
            | audio     |
            | image     |
