import { useEffect, useState } from "react";
import "./Home.css";
import CircleFilled from "../assets/icons/circle-with-tick-filled.svg";
import CircleOutline from "../assets/icons/circle-with-tick-outline.svg";
import Popup from "reactjs-popup";
import { Link } from "react-router-dom";
import { RingLoader } from "react-spinners";

export interface Hadith {
  chapterNumber: number;
  sectionNumber: number;
  sectionName: string;
  lessons: {
    lessonId: string;
    lessonName: string;
    lessonDescription: string;
    completed: boolean;
  }[];
}

function translateIcon(
  index: number,
  length: number,
  windowSize: number,
  direction: "left" | "right"
) {
  const halfWindowSize = windowSize / 2;

  const isFirstHalf = index < length / 2;
  const halfLength = Math.ceil(length / 2);
  const halfLengthFloor = Math.floor(length / 2);

  if (isFirstHalf) {
    const pixelShiftNumber = (halfWindowSize / (halfLength - 1)) * index;

    if (direction === "left") {
      return pixelShiftNumber * -1;
    }
    return pixelShiftNumber;
  } else {
    const pixelShiftNumber =
      halfWindowSize -
      (halfWindowSize / (halfLength - 1)) *
        (index - (length % 2 === 0 ? halfLength : halfLengthFloor));

    if (direction === "left") {
      return pixelShiftNumber * -1;
    }
    return pixelShiftNumber;
  }
}

const mockHadithes: Hadith[] = [
  {
    chapterNumber: 1,
    sectionNumber: 1,
    sectionName: "ХАЗІРЕТ МҰХАММЕДТІҢ (ﷺ) ДҮНИЕГЕ КЕЛУІ және БАЛАЛЫҚ ШАҒЫ",
    lessons: [
      {
        lessonId: "429fa2fa-488c-42c6-85c1-090f402d08fc",
        lessonName: "Lorem ipsum",
        lessonDescription: "Description",
        completed: true,
      },
      {
        lessonId: "8f4102f3-6454-4a17-89f2-4402f6efbb02",
        lessonName: "Ipsum Lorem",
        lessonDescription: "Description",
        completed: false,
      },
      {
        lessonId: "1f4102f3-6454-4a17-89f2-4402f6efbb02",
        lessonName: "Ipsum Lorem",
        lessonDescription: "Description",
        completed: false,
      },
      {
        lessonId: "2f4102f3-6454-4a17-89f2-4402f6efbb02",
        lessonName: "Ipsum Lorem",
        lessonDescription: "Description",
        completed: false,
      },
      {
        lessonId: "3f4102f3-6454-4a17-89f2-4402f6efbb02",
        lessonName: "Ipsum Lorem",
        lessonDescription: "Description",
        completed: false,
      },
      //   {
      //     lessonId: "3f4202f3-6454-4a17-89f2-4402f6efbb02",
      //     lessonName: "Ipsum Lorem",
      //     lessonDescription: "Description",
      //     completed: false,
      //   },
    ],
  },
  {
    chapterNumber: 2,
    sectionNumber: 2,
    sectionName: "Section two name ",
    lessons: [
      {
        lessonId: "429fa2fa-488c-42c6-85c1-090f402d08fc",
        lessonName: "Lorem ipsum",
        lessonDescription: "Description",
        completed: true,
      },
      {
        lessonId: "8f4102f3-6454-4a17-89f2-4402f6efbb02",
        lessonName: "Ipsum Lorem",
        lessonDescription: "Description",
        completed: false,
      },
      {
        lessonId: "1f4102f3-6454-4a17-89f2-4402f6efbb02",
        lessonName: "Ipsum Lorem",
        lessonDescription: "Description",
        completed: false,
      },
      {
        lessonId: "2f4102f3-6454-4a17-89f2-4402f6efbb02",
        lessonName: "Ipsum Lorem",
        lessonDescription: "Description",
        completed: false,
      },
      {
        lessonId: "3f4102f3-6454-4a17-89f2-4402f6efbb02",
        lessonName: "Ipsum Lorem",
        lessonDescription: "Description",
        completed: false,
      },
    ],
  },
];

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [hadithes, setHadithes] = useState<Hadith[] | null>(null);
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
  async function fetchHadithes() {
    return new Promise<Hadith[]>((resolve) => {
      setTimeout(() => {
        resolve(mockHadithes);
      }, 1000);
    });
  }
  useEffect(() => {
    fetchHadithes().then((data) => {
      setHadithes(data);
      setIsLoading(false);
    });
  }, []);
  return (
    <main>
      {isLoading ? (
        <RingLoader size={120} className="loading-spinner" color="#01AB01" />
      ) : (
        <div>
          {hadithes!.map((hadith, indexHadith) => (
            <div key={hadith.sectionName}>
              <div className="hadith-info-card">
                <span>
                  Тарау {hadith.sectionNumber}, Бөлім {hadith.chapterNumber}
                </span>
                <h2>{hadith.sectionName}</h2>
              </div>
              <div>
                {hadith.lessons.map((lesson, index) => (
                  <div className="lesson-link-container" key={index}>
                    <span
                      style={{
                        transform: `translateX(${translateIcon(
                          index,
                          hadith.lessons.length,
                          windowSize[0] - 150,
                          indexHadith % 2 === 0 ? "left" : "right"
                        )}px)`,
                      }}
                      className="lesson-link"
                    >
                      <Popup
                        trigger={() => (
                          <img src={lesson.completed ? CircleFilled : CircleOutline} alt="" />
                        )}
                        position={["top left", "top center", "bottom right", "bottom left"]}
                        closeOnDocumentClick
                      >
                        {index === 0 || (index > 0 && hadith.lessons[index - 1].completed) ? (
                          <LessonLinkPopup
                            lesson={{
                              lessonName: lesson.lessonName,
                              lessonDescription: lesson.lessonDescription,
                              lessonId: lesson.lessonId,
                              completed: lesson.completed,
                            }}
                          />
                        ) : (
                          <LessonLinkDisabledPopup
                            lesson={{
                              lessonName: lesson.lessonName,
                              lessonDescription: lesson.lessonDescription,
                            }}
                          />
                        )}
                      </Popup>
                      {}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function LessonLinkPopup({
  lesson: { lessonName, lessonDescription, lessonId, completed },
}: {
  lesson: {
    lessonName: string;
    lessonDescription: string;
    lessonId: string;
    completed: boolean;
  };
}) {
  return (
    <div className="lesson-popup-content">
      <h3 className="name">{lessonName}</h3>
      <p className="description">{lessonDescription}</p>
      <Link className="lesson-link-active" to={`/lessons/${lessonId}`}>
        {completed ? "Қайталау" : "Бастау"}
      </Link>
    </div>
  );
}
function LessonLinkDisabledPopup({
  lesson: { lessonName, lessonDescription },
}: {
  lesson: {
    lessonName: string;
    lessonDescription: string;
  };
}) {
  return (
    <div className="lesson-popup-content">
      <h3 className="name">{lessonName}</h3>
      <p className="description">{lessonDescription}</p>
      <p className="disabled-text">Бұл сабақты ашу үшін, алдыңғы сабақты өтуіңіз қажет</p>
      <a className="lesson-link-disabled">Бастау</a>
    </div>
  );
}
export default Home;
