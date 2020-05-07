export interface ICommentCreate {
    solutionId: number;
    studentId?: number;
    teacherId?: number;
    text: string;
    fileLink?: string;
    fileNameExtension?:string
}
