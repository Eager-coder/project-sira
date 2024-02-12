import { useNavigate } from "react-router-dom";
import ArrowLeftIcon from "../assets/icons/arrow-left.svg";
import { useEffect, useState } from "react";
import "./Quiz.css";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface QuizQuestion {
  questionId: number;
  quesitonText: string;
  answers: {
    text: string;
    isCorrect: boolean;
    selected: boolean;
  }[];
  userAnswer: null | {
    text: string;
    isCorrect: boolean;
    selected: boolean;
  };
}

const mockQuestions: QuizQuestion[] = [
  {
    questionId: 1,
    quesitonText: "Lorem ipsum dolor mit?",
    answers: [
      {
        text: "Answer 1",
        isCorrect: false,
      },
      {
        text: "Answer 2",
        isCorrect: false,
      },
      {
        text: "Answer 3",
        isCorrect: true,
      },
      {
        text: "Answer 4",
        isCorrect: false,
      },
      {
        text: "Answer 5",
        isCorrect: false,
      },
    ],
  },
  {
    questionId: 2,
    quesitonText: "Ipsum  lorem dolor mit?",
    answers: [
      {
        text: "Answer 1",
        isCorrect: false,
      },
      {
        text: "Answer 2",
        isCorrect: true,
      },
      {
        text: "Answer 3",
        isCorrect: false,
      },
      {
        text: "Answer 4",
        isCorrect: false,
      },
      {
        text: "Answer 5",
        isCorrect: false,
      },
    ],
  },
  {
    questionId: 3,
    quesitonText: "Ipsum  lorem dolor mit?",
    answers: [
      {
        text: "Answer 1",
        isCorrect: false,
      },
      {
        text: "Answer 2",
        isCorrect: true,
      },
      {
        text: "Answer 3",
        isCorrect: false,
      },
      {
        text: "Answer 4",
        isCorrect: false,
      },
      {
        text: "Answer 5",
        isCorrect: false,
      },
    ],
  },
];

function Quiz() {
  const navigate = useNavigate();
  const [quizFinished, setQuizFinished] = useState(false);

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(
    mockQuestions.map((questions) => {
      return {
        ...questions,
        userAnswer: null,
      };
    })
  );
  const [activeQuiz, setActiveQuiz] = useState(quizQuestions[0]);
  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    setActiveQuiz((prev) => {
      return quizQuestions.find((question) => question.questionId === prev.questionId)!;
    });
  }, [quizQuestions]);

  function selectAnswer(option: string) {
    if (activeQuiz.userAnswer) {
      return;
    }

    setQuizQuestions((prev) =>
      prev.map((question: QuizQuestion) => {
        if (question.questionId === activeQuiz.questionId) {
          const updatedAnswers = question.answers.map((answer) => {
            if (answer.text === option) {
              return {
                ...answer,
                selected: true,
              };
            } else {
              return { ...answer, selected: false };
            }
          });
          return {
            ...question,
            answers: updatedAnswers,
            userAnswer: {
              ...question.answers.find((answer) => answer.text === option)!,
              selected: false,
            },
          };
        }
        return question;
      })
    );
  }

  function getOptionClassName(option: string) {
    const selectedOption = activeQuiz.answers.find((answer) => answer.text === option);
    if (selectedOption && selectedOption.selected) {
      if (selectedOption.isCorrect) return "option-correct";
      return "option-wrong";
    }
    return "";
  }

  function moveToNextQuestion() {
    if (activeQuiz.questionId < quizQuestions.length) {
      setActiveQuiz(quizQuestions[activeQuiz.questionId]);
    } else {
      setQuizFinished(true);
    }
  }

  return (
    <main>
      <header>
        <div onClick={() => navigate(-1)} className="link-to-main">
          <img src={ArrowLeftIcon} alt="" />
        </div>
        <h1>{quizFinished ? "Сынақтама бағасы" : "Сынақтама"}</h1>
      </header>
      {quizFinished ? (
        <QuizScore quizQuestions={quizQuestions} />
      ) : (
        <section>
          <div className="progress-bar">
            <div
              style={{
                width: activeQuiz.questionId * ((windowSize[0] - 32) / quizQuestions.length) + "px",
              }}
              className="progress-bar-filled"
            ></div>
          </div>

          <div className="question-container">
            <p>{activeQuiz.questionId} сұрақ</p>
            <h2>{activeQuiz.quesitonText}</h2>
          </div>
          <div className="answers-container">
            {activeQuiz.answers.map((option) => (
              <div
                className={getOptionClassName(option.text)}
                onClick={() => selectAnswer(option.text)}
                key={option.text}
              >
                {option.text}
              </div>
            ))}
          </div>
          <button onClick={moveToNextQuestion} className="next">
            Жалғастыру
          </button>
        </section>
      )}
    </main>
  );
}

function QuizScore({ quizQuestions }: { quizQuestions: QuizQuestion[] }) {
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (quizQuestions.every((question: QuizQuestion) => question.userAnswer)) {
      const newScore = quizQuestions.reduce((acc, question) => {
        const correctAnswer = question.answers.find((answer) => answer.isCorrect);

        return question.userAnswer?.text === correctAnswer?.text ? acc + 1 : acc;
      }, 0);
      setScore(newScore);
    }
  }, [quizQuestions]);
  console.log(score);
  return (
    <div className="quiz-score">
      <div className="score-result-container">
        <CircularProgressbarWithChildren
          styles={buildStyles({
            pathColor: "#01AB01",
            textColor: "#01AB01",
          })}
          strokeWidth={6}
          maxValue={quizQuestions.length}
          value={score}
          counterClockwise
        >
          <p className="score-percent">{Math.round((score / quizQuestions.length) * 100)}%</p>
          <p className="score-count">
            {score}/{quizQuestions.length}
          </p>
        </CircularProgressbarWithChildren>
      </div>
      <p className="score-message">
        Сынақтан өтуімен <br /> құттықтаймыз!
      </p>
      <button onClick={() => navigate(-1)} className="finish">
        Аяқтау
      </button>
    </div>
  );
}

export default Quiz;
