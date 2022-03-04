import { appendFileSync } from 'fs';
import moment from 'moment';

export class Logger {
    private static readonly logfile = 'log.txt';
    private static showOnConsole = process.argv[2] === 'console'; 

    public static error(message: string, error: Error) {
        Logger.log(message, 'error', error);
    }

    public static warn(message: string) {
        Logger.log(message, 'warn');
    }

    public static info(message: string) {
        Logger.log(message, 'info');
    }

    private static log(message: string, logLevel: 'error' | 'warn' | 'info', error?: Error) {
        const logMessage = `[${moment().format('MM/DD/YYYY HH:MM:SS')}]  [${logLevel.toUpperCase()}]:     ${message} ${error.message}\n${error.stack}\n`;
        appendFileSync(this.logfile, logMessage);

        if (Logger.showOnConsole) {
            switch(logLevel) {
                case 'warn': console.warn(message); break;
                case 'error': console.error(message, error); break;
                case 'info': console.info(message); break;
            }
        }
    }
}
