export const cardiologyConditions = {
  chestPain: {
    symptoms: [
      'chest pain', 'chest tightness', 'chest pressure', 'heart pain',
      'angina', 'chest discomfort', 'heart attack symptoms',
      'crushing chest pain', 'radiating chest pain', 'left arm pain',
      'chest heaviness', 'heart pressure', 'cardiac pain',
      'chest burning', 'chest squeezing'
    ],
    response: `Based on your description of chest pain, this could indicate:

IMPORTANT: If experiencing severe chest pain, seek immediate medical attention!

Possible causes:
1. Angina (reduced blood flow to heart)
2. Myocardial infarction (heart attack)
3. Pericarditis (heart inflammation)
4. Stress-related chest pain
5. Costochondritis
6. GERD (acid reflux)
7. Muscle strain

Immediate actions:
- Call emergency services if severe
- Sit down and rest
- Take prescribed medications (if any)
- Note timing and characteristics
- Document associated symptoms

General recommendations:
- Rest and avoid exertion
- Take prescribed medications
- Monitor symptoms closely
- Keep a symptom log
- Regular cardiac check-ups

Warning signs requiring immediate care:
- Severe or crushing pain
- Pain with shortness of breath
- Nausea or vomiting
- Sweating with pain
- Dizziness or fainting

Note: This is preliminary advice. Always consult a cardiologist for proper diagnosis.`
  },
  palpitations: {
    symptoms: [
      'heart palpitations', 'racing heart', 'irregular heartbeat', 
      'skipped beats', 'rapid heartbeat', 'heart flutter',
      'heart racing', 'pulse racing', 'heart skipping',
      'heart pounding', 'fast heartbeat', 'heart rhythm problems',
      'heart beating fast', 'heart beating hard'
    ],
    response: `Your symptoms suggest heart palpitations, which can be caused by:

Common causes:
1. Stress or anxiety
2. Caffeine or stimulants
3. Arrhythmia
4. Thyroid issues
5. Electrolyte imbalances
6. Medications
7. Dehydration

Immediate actions:
- Sit or lie down
- Practice deep breathing
- Avoid stimulants
- Stay hydrated
- Record episode details

Recommendations:
- Avoid caffeine and stimulants
- Practice relaxation techniques
- Monitor heart rate
- Keep a symptom diary
- Schedule a cardiac evaluation
- Maintain good sleep habits
- Stay well-hydrated

Seek immediate care if:
- Chest pain occurs
- Shortness of breath
- Dizziness or fainting
- Persistent rapid heart rate
- Severe anxiety

Important: If palpitations are frequent or concerning, consult a cardiologist.`
  },
  hypertension: {
    symptoms: [
      'high blood pressure', 'hypertension', 'blood pressure high',
      'headache with high bp', 'dizziness with bp',
      'elevated blood pressure', 'systolic high', 'diastolic high',
      'blood pressure elevated', 'hypertensive', 'pressure high',
      'blood pressure problems', 'bp high', 'high bp'
    ],
    response: `High blood pressure (hypertension) management advice:

Common causes:
1. Diet high in sodium
2. Lack of exercise
3. Stress
4. Genetics
5. Obesity
6. Sleep apnea
7. Certain medications

Lifestyle recommendations:
- Monitor blood pressure regularly
- Reduce salt intake
- Exercise moderately
- Manage stress
- Take prescribed medications
- Maintain healthy weight
- Limit alcohol
- Quit smoking
- Get adequate sleep

Dietary changes:
- Follow DASH diet
- Reduce sodium intake
- Increase potassium-rich foods
- Limit processed foods
- Eat more fruits and vegetables

Warning signs:
- Severe headache
- Vision problems
- Chest pain
- Difficulty breathing
- Irregular heartbeat

Schedule regular check-ups with your healthcare provider.`
  }
};