const TIMES = {
    SECOND: 1,
    MINUTE: 60,
    HOUR: 3600,
    DAY: 86400,
    MONTH: 2678400,
};
  
const CRON_POSITION = [
    TIMES.SECOND, 
    TIMES.MINUTE, 
    TIMES.HOUR, 
    TIMES.DAY,
    TIMES.MONTH
];
  
class CronHelpers {

    static getCronExpression(seconds) {
        let secsLeft;
        const month = Math.floor(seconds / TIMES.MONTH);
        secsLeft = seconds % TIMES.MONTH;

        const day = Math.floor(secsLeft / TIMES.DAY);
        secsLeft %= TIMES.DAY;

        const hour = Math.floor(secsLeft / TIMES.HOUR);
        secsLeft %= TIMES.HOUR;

        const minute = Math.floor(secsLeft / TIMES.MINUTE);
        secsLeft %= TIMES.MINUTE;

        const result = [secsLeft, minute, hour, day, month, 0];

        return result.map((item, index) => {
            const next = result[index + 1];
            
            if (item === 0 && next !== 0 && next !== undefined) {
                return '0';
            }
            
            return item === 0 ? '*' : `*/${item}`;
        }).join(' ');
    }

    static getIntervalFromCron(cron) {
        const values = cron.split(' ');
        const result = values.reduce((prev, current, index) => {
            const value = Number(current.split('/')[1]);

            if (!Number.isNaN(value)) {
                return prev + value * CRON_POSITION[index];
            }

            return prev;
        }, 0);

        return result;
    }
}
  
module.exports = CronHelpers;  