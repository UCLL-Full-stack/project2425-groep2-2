import { Priority as PriorityPrisma } from '@prisma/client';

export class Priority{
    private id?: number;
    private levelName: string;
    private colour: string;

    constructor(priority : {levelName: string; colour: string}) {
        this.levelName = priority.levelName;
        this.colour = priority.colour;
    }

    getLevelName(): string {
        return this.levelName;
    }
    getColour(): string {
        return this.colour;
    }

    static from({id, levelName, colour}: PriorityPrisma){
        return new Priority({levelName, colour});
    }
}