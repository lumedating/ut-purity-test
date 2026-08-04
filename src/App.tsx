import { useEffect, useState } from 'react'
import { useFeatureFlagVariantKey, usePostHog } from '@posthog/react'
import logo from './assets/UT Purity Test Logo.png'
import lumeLogo from './assets/Lume Logo (NEW & Cropped).png'
import './App.css'

const LUME_APP_URL =
  'https://apps.apple.com/us/app/lume-the-daily-dating-game/id6752439265'

const PROMO_FLAG_KEY = 'purity-test-cta'

type ScoreTier = 'low' | 'medium' | 'high'

const PROMO_COPY: Record<
  ScoreTier,
  { control: { before: string; link: string }; test: { before: string; link: string } }
> = {
  // Pure / high purity score
  low: {
    control: {
      before: "Somebody's overdue for a good date. ",
      link: "That's what Lume's for →",
    },
    test: {
      before: 'Your story needs a plot twist. ',
      link: 'Lume can help →',
    },
  },
  // Mid purity
  medium: {
    control: {
      before: 'Solid score. Now go get a solid date. ',
      link: 'Download Lume →',
    },
    test: {
      before: "You've got a few stories, but not enough. ",
      link: 'Lume can fix that →',
    },
  },
  // Not pure / low purity score
  high: {
    control: {
      before: "You've clearly got game. ",
      link: 'Put it to use on Lume →',
    },
    test: {
      before: 'Bold moves deserve a bold date. ',
      link: 'Get yours on Lume →',
    },
  },
}

function getScoreTier(score: number): ScoreTier {
  if (score >= 51) return 'low'
  if (score >= 26) return 'medium'
  return 'high'
}

function renderQuestionText(question: string) {
  const marker = 'Lume'
  const index = question.indexOf(marker)
  if (index === -1) return question

  return (
    <>
      {question.slice(0, index)}
      <a
        className="question-lume-link"
        href={LUME_APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {marker}
      </a>
      {question.slice(index + marker.length)}
    </>
  )
}

const QUESTIONS = [
  'Current student at UT Austin?',
  'Lost your UT ID at least once?',
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
  "Lied to your parents about how you're doing in class?",
  'Vaped in class?',
  'Pregamed a class?',
  'Pregamed an exam?',
  'Missed a class due to a hangover?',
  'Painted your face burnt orange for a game?',
  'Jumped into Littlefield Fountain?',
  'Kissed someone at the turtle pond?',
  'Snuck into the Red River Rivalry game?',
  'Snuck onto the field at DKR?',
  'Gotten drunk at a tailgate party?',
  'Snuck into a campus building after hours?',
  'Advertised or sold something on Speedway?',
  'Taken a CapMetro bus?',
  'Snuck into the dining hall without a pass?',
  'Snuck food out of the dining hall?',
  "Eaten at Cabo Bob's?",
  "Had a drunk meal at Raising Cane's?",
  'Brought alcohol into on-campus housing?',
  'Gotten a noise complaint at your dorm/apartment?',
  'Snuck someone into your dorm after hours?',
  'Hosted a party in your dorm/apartment?',
  'Slept over with someone in Jester?',
  'Drank on campus?',
  'Smoked on campus?',
  'Pregamed an org meeting?',
  'Won a game of beer pong?',
  'Bought weed from Glassmith?',
  'Been high at ACL?',
  'Held hands with someone on campus?',
  'Kissed someone on campus?',
  'Made a YikYak post that went viral?',
  'Been on a date you found on Lume?',
  'Partied on 6th Street?',
  'Snuck into a 6th Street bar underage?',
  'Been kicked out of a 6th Street bar?',
  'Thrown up on 6th Street?',
  'Made out with a stranger at 6th Street?',
  'Been carried home by a friend after a night out?',
  'Babysat someone you just met who was drunk?',
  'Been to a UT frat party?',
  'Blacked out at a UT frat party?',
  'Been at a party while it was shut down by UTPD?',
  'Hooked up with someone you met at a frat party?',
  'Hooked up with someone on your dorm floor?',
  'Hooked up on school property?',
  'Had a walk of shame across campus?',
  'Kicked out your roommate to hook up?',
  'Been kicked out by your roommate so they could hook up?',
  'Walked in on your roommate mid-hookup?',
  'Been caught by your roommate mid-hookup?',
  'Hooked up with someone in a different grade?',
  'Hooked up with someone from a rival school while in college?',
  'Driven to Texas State (San Marcos) to have sex?',
  'Been skinny dipping at Hippie Hollow (nudist beach)?',
  'Hooked up with a TA?',
  'Hooked up with a professor?',
  'Been arrested by UTPD?',
]

function getScoreMessage(score: number): string {
  if (score >= 70) {
    return 'Have you even left your dorm room?'
  }
  if (score >= 60) {
    return 'West Campus curious, not West Campus fluent.'
  }
  if (score >= 50) {
    return "You've got stories, but you're saving the good ones."
  }
  if (score >= 40) {
    return "Okay, now we're getting somewhere."
  }
  if (score >= 30) {
    return 'Your parents would not love this score.'
  }
  if (score >= 20) {
    return 'The UTPD might have a file dedicated to you.'
  }
  if (score >= 10) {
    return 'At this point, are you even sure this is a purity test?'
  }
  return "You're officially a UT legend"
}

/** Approximate share of students with a higher purity score than `score`. */
function normalCdf(x: number, mean: number, stdDev: number): number {
  const z = (x - mean) / (stdDev * Math.SQRT2)
  const t = 1 / (1 + 0.3275911 * Math.abs(z))
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const erf =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z)
  const sign = z < 0 ? -1 : 1
  return 0.5 * (1 + sign * erf)
}

function getCrazierPercent(score: number): number {
  const mean = 46
  const stdDev = 13
  const denserThanYou = 1 - normalCdf(score + 0.5, mean, stdDev)
  return Math.min(99, Math.max(1, Math.round(denserThanYou * 100)))
}

function App() {
  const posthog = usePostHog()
  const promoVariant = useFeatureFlagVariantKey(PROMO_FLAG_KEY)
  const [checked, setChecked] = useState<Set<number>>(() => new Set())
  const [score, setScore] = useState<number | null>(null)
  const [shareLabel, setShareLabel] = useState('Share your results')

  const showResults = score !== null
  const variantKey = promoVariant === 'test' ? 'test' : 'control'
  const scoreTier = score !== null ? getScoreTier(score) : null
  const promo =
    scoreTier !== null ? PROMO_COPY[scoreTier][variantKey] : null

  useEffect(() => {
    if (!showResults || score === null || scoreTier === null) return
    posthog.capture('results_viewed', {
      promo_variant: variantKey,
      score_tier: scoreTier,
      score,
    })
  }, [showResults, variantKey, scoreTier, score, posthog])

  function toggleQuestion(index: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  function calculateScore() {
    const nextScore = QUESTIONS.length - checked.size
    setScore(nextScore)
    setShareLabel('Share your results')
  }

  function handleLumeClick() {
    if (score === null || scoreTier === null) return
    posthog.capture('lume_promo_clicked', {
      promo_variant: variantKey,
      score_tier: scoreTier,
      score,
    })
  }

  async function shareResults() {
    if (score === null || scoreTier === null) return

    const crazierPercent = getCrazierPercent(score)
    const shareText = `I scored ${score}/${QUESTIONS.length} on the UT Austin Purity Test (crazier than ${crazierPercent}% of other UT students)`

    posthog.capture('results_shared', {
      promo_variant: variantKey,
      score_tier: scoreTier,
      score,
    })

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'The UT Austin Purity Test',
          text: shareText,
          url: window.location.href,
        })
        return
      }

      await navigator.clipboard.writeText(
        `${shareText}\n${window.location.href}`,
      )
      setShareLabel('Copied!')
      window.setTimeout(() => setShareLabel('Share your results'), 2000)
    } catch {
      // User cancelled share sheet or clipboard failed — stay quiet.
    }
  }

  return (
    <main className="page">
      <img className="logo" src={logo} alt="UT Purity Test" />
      {!showResults && (
        <>
          <p className="intro">
            The official UT Austin Purity Test serves as a way for students to
            bond and track their experiences throughout their time at The
            University of Texas at Austin. It's a voluntary opportunity for
            students to reflect on their unique university journey.
          </p>
          <p className="caution">
            Caution: This is not a bucket list. Completion of all items on this
            test will likely result in extreme embarassment.
          </p>
          <p className="instructions">
            Click on every item you have done. Your purity score will be
            calculated at the end.
          </p>
        </>
      )}
      <div className={`test-box${showResults ? ' test-box--results' : ''}`}>
        {showResults ? (
          <div className="results">
            <p className="results-label">Your score:</p>
            <p className="results-score">{score}</p>
            <p className="results-percentile">
              You're crazier than {getCrazierPercent(score)}% of other UT
              students
            </p>
            <p className="results-message">{getScoreMessage(score)}</p>
            <button
              type="button"
              className="calculate-button"
              onClick={shareResults}
            >
              {shareLabel}
            </button>
            <div className="results-sponsor">
              <span className="results-sponsor-label">Sponsored by</span>
              <img
                className="results-sponsor-logo"
                src={lumeLogo}
                alt="Lume"
              />
            </div>
          </div>
        ) : (
          <>
            <ol className="question-list">
              {QUESTIONS.map((question, index) => (
                <li key={question} className="question">
                  <label className="question-label">
                    <span className="question-number">{index + 1}.</span>
                    <input
                      className="question-checkbox"
                      type="checkbox"
                      name={`q-${index + 1}`}
                      checked={checked.has(index)}
                      onChange={() => toggleQuestion(index)}
                    />
                    <span className="question-text">
                      {renderQuestionText(question)}
                    </span>
                  </label>
                </li>
              ))}
            </ol>
            <button
              type="button"
              className="calculate-button"
              onClick={calculateScore}
            >
              Calculate my score
            </button>
          </>
        )}
      </div>
      {showResults && promo && (
        <p className="lume-promo">
          {promo.before}
          <a
            className="lume-promo-link"
            href={LUME_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLumeClick}
          >
            {promo.link}
          </a>
        </p>
      )}
    </main>
  )
}

export default App
