import { Link } from "react-router-dom";
import ArrowLeftIcon from "../assets/icons/arrow-left.svg";
import "./Lesson.css";

const mockLesson = {
  videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  lessonName: "Hello world",
  lessonSummary: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde pariatur quisquam",
  lessonContent:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde pariatur quisquam quae et omnis asperiores illo officia! Eius dolorum iusto quos nemo doloremque modi molestias sint aliquam commodi? Quaerat corporis doloremque corrupti ad ex optio ipsum nobis iste? Quod impedit, sed neque magni quia voluptatem quam reiciendis dicta dolorum assumenda?",
  quizId: "23fgwr-23g4wrb-2g4rwb-4n6t5re",
};

function Lesson() {
  return (
    <main>
      <header>
        <Link to={"/"} className="link-to-main">
          <img src={ArrowLeftIcon} alt="" />
        </Link>
        <h1>{mockLesson.lessonName}</h1>
      </header>
      <section className="video-lesson">
        <div className="video-container">
          <video src={mockLesson.videoUrl} width="100%" controls />
        </div>
      </section>
      <section className="lesson-summary">
        <p className="header">Сипаттама</p>
        <p className="content">{mockLesson.lessonSummary}</p>
      </section>
      <section className="lesson-content">
        <p className="header">Конспектісі</p>
        <p className="content"> {mockLesson.lessonContent}</p>
      </section>
      <Link className="take-quiz-link" to={`/quiz/${mockLesson.quizId}`}>
        Тест өту
      </Link>
    </main>
  );
}

export default Lesson;
