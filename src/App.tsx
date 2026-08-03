import logo from './assets/UT Purity Test Logo.png'
import './App.css'

const QUESTIONS = [
  'Current student at UT Austin?',
  'Lost your UT ID?',
  'Changed your major?',
  'Dropped a class after the first week?',
  'Skipped a class without an excuse?',
  'Lied to a professor to miss class?',
  'Overslept and missed a class?',
  'Fallen asleep during class?',
  'Used ChatGPT for a class assignment?',
  'Used ChatGPT for an exam?',
  'Paid someone to do a class assignment?',
  'Been caught cheating in class?',
  'Failed an exam?',
  'Failed a class?',
  'Pulled an all-nighter before an exam?',
  'Spent more than 8 consecutive hours in the PCL?',
  'Fallen asleep in the PCL?',
  'Cried in Jester?',
  'Been in class with an ex?',
  "Lied to your parents about how you're doing in class?",
  'Painted your face burnt orange for a game?',
  'Napped on the South Mall?',
  'Jumped into Littlefield Fountain?',
  'Kissed at the turtle pond?',
  'Been to the Texas A&M campus?',
  'Snuck into the Red River Rivalry game?',
  'Gotten drunk at a tailgate party?',
  'Brought alcohol into on-campus housing?',
  'Gotten a noise complaint at your dorm/apartment?',
  'Snuck someone into a dorm after hours?',
  'Hosted a party in your dorm?',
  'Snuck food out of the dining hall?',
  'Thrown away an entire meal from a dining hall?',
  'Slept over with someone in Jester?',
  'Drank on campus?',
  'Smoked on campus?',
  'Vaped in class?',
  'Pregamed an org meeting?',
  'Pregamed a class?',
  'Won a game of beer pong?',
  'Missed a class due to a hangover?',
  'Partied on 6th Street?',
  'Snuck into a 6th Street bar underage?',
  "Had a drink at Cain & Abel's?",
  "Eaten at Cabo Bob's?",
  'Been kicked out of a 6th Street bar?',
  'Thrown up on 6th Street?',
  'Been carried home by a friend after a night out?',
  'Babysat someone you just met who was drunk?',
  'Been at a party when it was shut down by UTPD?',
  'Been to a UT frat party?',
  'Blacked out at a frat party?',
  'Rushed a fraternity or sorority?',
  'Gone to a formal with someone you just met?',
  'Bought weed from Glassmith?',
  'Been high at ACL?',
  'Made a YikYak post that went viral?',
  'Held hands with someone on campus?',
  'Kissed someone on campus?',
  'Been on a date you found on Lume?',
  'Won a date on Lume with someone in your class?',
  'Dated someone from a rival school?',
  'Made out with a stranger at 6th Street?',
  'Hooked up with someone on your dorm floor?',
  'Slept with someone you met at a frat party?',
  'Hooked up on school property?',
  'Had sex with someone in a different grade?',
  'Had sex with someone from a rival school while in college?',
  'Driven to Texas State (San Marcos) to have sex?',
  'Been skinny dipping at Hippie Hollow (nudist beach)?',
  'Had a walk of shame across campus?',
  'Walked in on your roommate mid-hookup?',
  'Been caught by your roommate mid-hookup?',
  'Been in a relationship with a TA?',
  'Been arrested by UTPD?',
]

function App() {
  return (
    <main className="page">
      <img
        className="logo"
        src={logo}
        alt="UT Purity Test"
      />
      <p className="intro">
        The official UT Austin Purity Test serves as a way for students to bond
        and track their experiences throughout their time at The University of
        Texas at Austin. It's a voluntary opportunity for students to reflect on
        their unique university journey.
      </p>
      <p className="caution">
        Caution: This is not a bucket list. Completion of all items on this test
        will likely result in extreme embarassment.
      </p>
      <p className="instructions">
        Click on every item you have done. Your purity score will be calculated
        at the end.
      </p>
      <div className="test-box">
        <ol className="question-list">
          {QUESTIONS.map((question, index) => (
            <li key={question} className="question">
              <label className="question-label">
                <span className="question-number">{index + 1}.</span>
                <input
                  className="question-checkbox"
                  type="checkbox"
                  name={`q-${index + 1}`}
                />
                <span className="question-text">{question}</span>
              </label>
            </li>
          ))}
        </ol>
        <button type="button" className="calculate-button">
          Calculate my score
        </button>
      </div>
    </main>
  )
}

export default App
