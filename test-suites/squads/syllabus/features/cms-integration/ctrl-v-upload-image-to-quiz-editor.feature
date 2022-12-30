@cms
@cms-syllabus-integration
@syllabus @question

Feature: [Integration] Paste the copied image to question/answer/explanation

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content have 1 quiz" book

    #TCID:syl-0152,syl-0153,syl-0154,syl-0155,syl-0156,syl-0157,syl-0158,syl-0159
    Scenario Outline: School admin pastes a copied image to <type> quiz when creating quiz
        Given school admin is at a LO detail page
        When school admin pastes copied image into editor and saves "<type>" quiz
            | type              | question | answer | explanation |
            | multiple choice   | 1        | 1      | 1           |
            | fill in the blank | 1        | 0      | 1           |
            | manual input      | 1        | 0      | 1           |
            | multiple answer   | 1        | 1      | 1           |
        Then school admin sees image shown on every field of "<type>" quiz
        Examples:
            | type              |
            | multiple choice   |
            | fill in the blank |
            | manual input      |
            | multiple answer   |

    #TCID:syl-0160
    Scenario Outline: School admin pastes 2 copied images to <type> quiz when editing quiz
        Given school admin is at a LO detail page
        And school admin has pasted a copied image to "<type>" quiz
            | type              | question | answer | explanation |
            | multiple choice   | 1        | 1      | 1           |
            | fill in the blank | 1        | 0      | 1           |
            | manual input      | 1        | 0      | 1           |
            | multiple answer   | 1        | 1      | 1           |
        When school admin pastes 2nd copied image into editor and saves "<type>" quiz
        Then school admin sees 2 image shown on every field of "<type>" quiz
        Examples:
            | type              |
            | multiple choice   |
            | fill in the blank |
            | manual input      |
            | multiple answer   |

    #TCID:syl-0161
    Scenario Outline: Image cannot be uploaded if admin saves question before image finish load
        Given school admin is at a LO detail page
        When school admin pastes copied image to "<type>" quiz
            | type              | question | answer | explanation |
            | multiple choice   | 1        | 1      | 1           |
            | fill in the blank | 1        | 0      | 1           |
            | manual input      | 1        | 0      | 1           |
            | multiple answer   | 1        | 1      | 1           |
        And school admin sees copied image is uploading and saves "<type>" quiz
        Then school admin sees 0 image shown on every field of "<type>" quiz
        Examples:
            | type              |
            | multiple choice   |
            | fill in the blank |
            | manual input      |
            | multiple answer   |
