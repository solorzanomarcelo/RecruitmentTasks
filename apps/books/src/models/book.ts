export default class Book {
    private id: string;
    private title: string;
    private author: string;
    private year: number;

    constructor(id: string, title: string, author: string, year: number) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
    }

    public getTitle(): string {
        return this.title;
    }

    public getAuthor(): string {
        return this.author;
    }

    public getYear(): number {
        return this.year;
    }
}