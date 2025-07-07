const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(bodyParser.json());

function reduceToArcana(n) {
  while (n > 22) {
    n = n.toString().split('').reduce((acc, val) => acc + parseInt(val), 0);
  }
  return n;
}

function calculateMatrix(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const p1 = reduceToArcana(day);
  const p2 = reduceToArcana(month);
  const p3 = reduceToArcana([...year.toString()].reduce((a, b) => a + parseInt(b), 0));
  const p4 = reduceToArcana(p1 + p2 + p3);
  const p5 = reduceToArcana(p1 + p2 + p3 + p4);
  const p6 = reduceToArcana(p1 + p2 + p3 + p4 + p5);
  const e1 = reduceToArcana(p1 + p2);
  const e2 = reduceToArcana(p2 + p3);
  const e3 = reduceToArcana(p3 + p4);
  const fatal = reduceToArcana(p4 + p5);
  const e4 = reduceToArcana(p5 + p1);
  const triangles = {
    T1: reduceToArcana(e4 + p1),
    T2: reduceToArcana(e4 + e1),
    T3: reduceToArcana(e1 + p1),
    T4: reduceToArcana(e1 + p2),
    T5: reduceToArcana(p2 + e2),
    T6: reduceToArcana(e2 + e1),
    T7: reduceToArcana(e2 + p3),
    T8: reduceToArcana(e3 + p3),
    T9: reduceToArcana(e3 + e2),
    T10: reduceToArcana(e3 + p4),
    T11: reduceToArcana(p4 + fatal),
    T12: reduceToArcana(fatal + e3),
    T13: reduceToArcana(fatal + p5),
    T14: reduceToArcana(p5 + e4),
    T15: reduceToArcana(e4 + fatal),
  };

  return {
    PERSONA: {
      "Core Program": p1,
      "Legacy Influence": [e4, e1],
      "Inner Vectors": [triangles.T1, triangles.T2, triangles.T3]
    },
    BLOODLINE: {
      "Core Program": p2,
      "Legacy Influence": [e1, e2],
      "Inner Vectors": [triangles.T4, triangles.T5, triangles.T6]
    },
    CAREER: {
      "Core Program": p3,
      "Legacy Influence": [e2, e3],
      "Inner Vectors": [triangles.T7, triangles.T8, triangles.T9]
    },
    RELATIONSHIPS: {
      "Core Program": p4,
      "Legacy Influence": [e3, fatal],
      "Inner Vectors": [triangles.T10, triangles.T11, triangles.T12]
    },
    ENERGY: {
      "Core Program": p5,
      "Legacy Influence": [fatal, e4],
      "Inner Vectors": [triangles.T13, triangles.T14, triangles.T15]
    },
    "ERROR FATALE": fatal,
    "FINAL GOAL": p6
  };
}
app.options('/api/calculate', cors()); // Handle preflight request

app.post('/api/calculate', (req, res) => {
  const { birthdate } = req.body;
  if (!birthdate) return res.status(400).json({ error: 'No birthdate provided' });
  const result = calculateMatrix(birthdate);
  res.json(result);
});

app.get('/', (req, res) => res.send('UN/FOLD Backend API Running 🔥'));
app.listen(5000, () => console.log('Server running on port 5000'));
