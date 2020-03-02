export default abstract class DateTools {
    static now = (): string => new Date().toISOString().slice(0, 10).split('-').reverse().join('-');
    static convert = (date: Date): string => date.toISOString().slice(0, 10).split('-').reverse().join('-');
}
