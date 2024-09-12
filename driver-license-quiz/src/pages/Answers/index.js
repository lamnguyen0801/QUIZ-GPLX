import { useState, useEffect } from "react";
import { Table } from "antd";
import { getAnswerByUserId } from "../../services/answerService";
import { Link } from "react-router-dom";
import { getListQuestion } from "../../services/questionService";
import "./Answers.scss";

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, PointElement, Title, Legend } from 'chart.js';
ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, PointElement, Title, Legend);

function Answers() {
    const [dataResult, setDataResult] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const dataAnswers = await getAnswerByUserId(); // lấy các bài test của user có id hiện tại     
            const dataQuestions = await getListQuestion();

            const finalResult = dataAnswers.map(item => {
                let listAnswerQuestion = [];
                for (let i = 0; i < item.answerQuestion.length; i++) {
                    const question = dataQuestions.find(ques => ques.id === item.answerQuestion[i].questionId);
                    const answerUser = item.answerQuestion[i];

                    if (question) {
                        listAnswerQuestion.push({
                            ...answerUser,
                            ...question
                        });
                    }
                }

                // số câu đúng và % đúng
                const quantityQuestion = listAnswerQuestion.length;
                const correctAnswer = listAnswerQuestion.filter(item => item.answerUser === parseInt(item.correctAnswer)).length; //
                const percentCorrect = (correctAnswer * 100 / quantityQuestion).toFixed(2);

                return (
                    {
                        ...item,
                        answerQuestion: [...listAnswerQuestion],
                        percentCorrect: percentCorrect
                    }
                );
            })
            setDataResult(finalResult);
        };
        fetchApi();
    }, []);

    const dataSource = dataResult.map((item, index) => {
        const quantityQuestion = item.answerQuestion.length;
        const percent = item.percentCorrect;
        return (
            {
                key: item.id,
                stt: ++index,
                quantityQuestion: quantityQuestion,
                percentCorrect: `${percent}%`,
                test: <Link to={"/result/" + item.id}>Xem chi tiết</Link>
            }
        );
    })

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            sorter: (a, b) => a.stt - b.stt, // để ý key và key trong dataSource
            multiple: 3,
        },
        {
            title: 'Số câu',
            dataIndex: 'quantityQuestion',
            key: 'quantityQuestion',
            sorter: (a, b) => a.quantityQuestion - b.quantityQuestion, // để ý key và key trong dataSource
            multiple: 2,
        },
        {
            title: 'Tỉ lệ đúng',
            dataIndex: 'percentCorrect',
            key: 'percentCorrect',
            sorter: (a, b) => parseFloat(a.percentCorrect) - parseFloat(b.percentCorrect),
            multiple: 1, // ưu tiên càng nhỏ càng dc ưu tiên
        },
        {
            title: 'Bài test',
            dataIndex: 'test',
            key: 'test',
        },
    ]

    const data = {
        labels: dataResult.map(item => "Bài test " + item.id),
        datasets: [
            {
                label: 'Tỉ lệ đúng (%)',
                data: dataResult.map(item => item.percentCorrect),
                borderColor: '#2b4034',
                pointRadius: 5, // Kích thước điểm
                pointBackgroundColor: '#DFF3EC', // Màu sắc của điểm

            }
        ]
    };

    // Cập nhật kích thước font cho biểu đồ dựa trên kích thước màn hình
    const getResponsiveFontSize = () => {
        if (window.innerWidth <= 320) {
            return 10;
        }
        return 13; // Mặc định cho các màn hình lớn hơn
    };

    const options = {
        scales: {
            x: {
                ticks: {
                    font: {
                        size: getResponsiveFontSize(),
                        weight: 'bold'
                    }
                }
            },
            y: {
                ticks: {
                    font: {
                        size: getResponsiveFontSize(),
                        weight: 'bold'
                    }
                }
            }
        }
    }

    return (
        <>
            <div className="answers">
                <div className="answers__table">
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={{ pageSize: 5 }}
                    />
                </div>

                <div className="answers__chart">
                    <Line data={data} options={options} />
                </div>
            </div>
        </>
    );
}

export default Answers;