import { writeFileSync, existsSync, mkdirSync } from 'fs';
import moment from 'moment';

export class Logger {
    private static readonly logDir = 'logs';
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

    private static createLogDir() {
        if (!existsSync(this.logDir)) {
            mkdirSync(this.logDir);
        }
    }

    private static log(message: string, logLevel: 'error' | 'warn' | 'info', error?: Error) {
        const logMessage = `\n[${moment().format('MM/DD/YYYY HH:MM:SS')}]  [${logLevel.toUpperCase()}]:     ${message} ${error?.message ?? ''}\n${error?.stack ?? ''}`;

        this.createLogDir();
        writeFileSync(`${this.logDir}/${this.logfile}`, logMessage, { flag: 'a' });

        if (Logger.showOnConsole) {
            switch(logLevel) {
                case 'warn': console.warn(message); break;
                case 'error': console.error(message, error); break;
                case 'info': console.info(message); break;
            }
        }
    }
}
