
export type Priority = {
    levelName: string;
    colour: string;
}

export type Task = {
    id: number;
    description: string;
    sidenote: string;
    startDate: Date;
    endDate: Date;
    deadline: Date;
    done: boolean;
    priority: Priority
    user: User;
  };

export type User = {
    id: number;
    username?: string;
    password?: string;
}

export type StatusMessage = {
    message: string,
    type: "error" | "success";

}