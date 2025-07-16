This questionnaire is designed to screen for burnout.

The values for each questionnaire response have the following meanings
'Never', answer: '1',
'Rarely', answer: '2',
'Sometimes', answer: '3',
'Often', answer: '4',
'Very often', answer: '5',

The content of each questionnaire is as follows

'How many times have you been upset by something unexpected?': {answer1},
'How many times have you felt out of control of important things in your life?': {answer2},
'How many times have you felt tense and stressed?': {answer3},
'How many times have you been confident in your ability to handle personal problems?': {answer4},
'How often were you able to control your anger?' : {answer5},
'How many times did you feel that you could not handle what you had to do?' : {answer6},
'How many times did you feel that you were in a very good mood? ' : {answer7},
'How often did you get angry when things didn't go your way?' : {answer8},
'How often did you feel that difficulties had piled up and were insurmountable?' : {answer9},
'How often did you feel that things were going your way?' : {answer10},


The Mental object you receive in response should contain the following
- "score" (Integer): The sum of the scores in the questionnaire must be between at least 10 and 50, and 'score' must have a value between at least 0 and 100.
- "psychologicalState" (enum [ Normal, Concern, Mild, Severe, Critical ]): Indicates what the psychological state is.
- "resultContent" (String, length=512) : Write the AI's judgment in Korean. Hangul is 3 bytes per character, so it should be written within 170 characters.

        Format: {format} only.

Translated with DeepL.com (free version)