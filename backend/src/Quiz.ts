import { IoManager } from "./managers/IoManager";
export type AllowedSubmissions = 0 | 1 | 2 | 3;
const PROBLEM_TIME_S = 20;

interface User {
    name: string;
    id: string;
    points: number;
}

interface Submission { // problemId, userId, isCorrect, optionSelected : Allow
    problemId: string;
    userId: string;
    isCorrect: boolean;
    optionSelected: AllowedSubmissions
}

interface Problem {
    title: string;
    description: string;
    image: string;
    startTime: number;
    answer: AllowedSubmissions
    options: {
        id: number,
        title: string
    }[]
    submissions: Submission[]
}

export class Quiz {
    private roomId: string;
    private hasStarted: boolean;
    private problems: Problem[];
    private activeProblem: number;
    private users: User[];
    private currentState: "leaderboard" | "quesition" | "not_started" | "ended";

    constructor(roomId: string) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = "not_started";
        console.log("room created");
        setInterval(() => {
            this.debug()
        }, 10000)
    }

    debug() {
        console.log("---debug---")
    }

    addProblem(problem: Problem) {
        this.problems.push(problem);
    }

    start() {
        this.hasStarted = true;
        const io = IoManager.getIo();
        io.emit("CHANGE_PROBLEM", {
            problem: this.problems[0]
        })
    }

    next() {
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        const io = IoManager.getIo();
        if (problem) {
            io.emit("CHANGE_PROBLEM", {
                problem
            })
        } else {
            io.emit("QUIZ_END", {
                problem
            })
        }
    }
}