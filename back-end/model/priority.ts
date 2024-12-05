import { Priority as PriorityPrisma } from '@prisma/client';

export class Priority{
    private id?: number;
    private levelName: string;
    private colour: string;

    constructor(priority : {id?: number; levelName: string; colour: string}) {
        this.id = priority.id;
        this.levelName = priority.levelName;
        this.colour = priority.colour;
    }

    getLevelName(): string {
        return this.levelName;
    }
    getColour(): string {
        return this.colour;
    }
    getId(): number | undefined {
        return this.id;
    }
    equals(priority: Priority): boolean {
        return this.levelName === priority.getLevelName() && this.colour === priority.getColour();
    }

    static from({id,levelName, colour}: PriorityPrisma){
        return new Priority({id,levelName, colour});
    }
}