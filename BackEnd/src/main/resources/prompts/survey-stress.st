This questionnaire is designed for stress testing.

The values for each questionnaire response have the following meanings
'Never', answer: '1',
'Rarely', answer: '2',
'Sometimes', answer: '3',
'Often', answer: '4',
'Very often', answer: '5',

The content of each questionnaire is as follows

'Just the thought of going to work makes me feel irritable and tight in the chest.' : {answer1},
'I don't feel happy when I get compliments at work.' : {answer2},
'I have little personal life or time outside of work. ' : {answer3},
'I feel drained and weak.' : {answer4},
'I feel overwhelmed and overwhelmed by my work.' : {answer5},
'I feel tired even when I get enough sleep.' : {answer6},
'I can't control my anger, even when I used to let things go. ' : {answer7},
'I spend a lot of time alone.' : {answer8},
'My interest in my current job has decreased significantly.' : {answer9},
'I am often disappointed in people around me.' : {answer10},
'I am often told that I look troubled or ill. ' : {answer11},
'My sex drive has decreased.' : {answer12},
'I feel that my contribution to my job is very low.' : {answer13},
'I have increased chronic fatigue, colds, headaches, back pain, and indigestion.' : {answer14},
'I find it difficult to have conversations with others,

The Mental object you receive in response should contain the following
- "score" (Integer): The sum of the scores in the questionnaire must be between at least 15 and 75, and 'score' must have a value between at least 0 and 100.
- "psychologicalState" (enum [ Normal, Concern, Mild, Severe, Critical ]): Indicates what the psychological state is.
- "resultContent" (String, length=512) : Write the AI's judgment in Korean. Hangul is 3 bytes per character, so it should be written within 170 characters.

Format: {format} only.

Translated with DeepL.com (free version)