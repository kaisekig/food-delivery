export class UnixTimestamp {
    static now() {
        return new Date().getTime() / 1000;
    }
    static futureDays(days: number): number {
        let exp = new Date();
        exp.setDate(exp.getDate() + days);

        return exp.getTime() / 1000;
    }

    static futureHours(hours: number): number {
        let exp = new Date();
        exp.setHours(exp.getHours() + hours);

        return exp.getTime() / 1000;
    }

    static futureMinutes(minutes: number): number {
        let exp = new Date();
        exp.setMinutes(exp.getMinutes() + minutes);

        return exp.getTime() / 1000;
    }

    static futureSeconds(seconds: number): number {
        let exp = new Date();
        exp.setSeconds(exp.getSeconds() + seconds);

        return exp.getTime() / 1000;
    }

    static isoDate(timestamp: number): string {
        let date = new Date();
        date.setTime(timestamp * 1000);

        return date.toISOString();
    }

    static databaseDateFormat(isoFormat: string): string {
        return isoFormat.substring(0, 19).replace('T', ' ');
    } 
}