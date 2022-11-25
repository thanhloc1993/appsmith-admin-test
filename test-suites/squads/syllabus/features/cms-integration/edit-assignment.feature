@cms
@cms-syllabus-integration
@syllabus @assignment

Feature: [Integration] School admin edits assignment integration test
    Background:
        Given "school admin" logins CMS
        And school admin is at book page
        And school admin has created a "simple content with an assignment" book
        And school admin goes to book detail page
        And school admin goes to assignment edit page

    #TCID:syl-0029
    Scenario Outline: School admin edits an assignment with <field>
        When school admin "edits" an assignment with "<field>"
        Then school admin sees message "You have updated assignment successfully"
        And school admin sees "edited" assignment with "<field>" on CMS

        Examples:
            | field            |
            | description      |
            | no description   |
            | no require grade |
            | random settings  |
            | all settings     |

    #TCID:None
    Scenario Outline: School admin edits an assignment with upload <material>
        When school admin "edits" an assignment with upload "<material>"
        Then school admin sees message "You have updated assignment successfully"
        And school admin sees "edited" assignment with material on CMS

        Examples:
            | material   |
            | file       |
            | brightcove |

    #TCID:None
    Scenario Outline:  School admin cannot edit assignment with missing <field>
        When school admin "edits" an assignment with missing "<field>"
        Then school admin cannot "edit" any assignment

        Examples:
            | field |
            | name  |
            | grade |
