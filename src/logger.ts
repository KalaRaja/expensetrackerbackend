import { existsSync, mkdirSync, writeFileSync } from 'fs';
import moment from 'moment';

export class Logger {
    private static readonly logDir = 'logs';
    private static readonly logfile = 'log.txt';
    private static showOnConsole = process.argv[2] === 'console'; 

    public static error(message: string, error?: Error) {
        Logger.log(message, 'error', error);
    }

    public static warn(message: string, warningObject?: any) {
        Logger.log(message, 'warn', warningObject);
    }

    public static info(message: string, infoObject?: any) {
        Logger.log(message, 'info', infoObject);
    }

    private static createLogDir() {
        if (!existsSync(this.logDir)) {
            mkdirSync(this.logDir);
        }
    }

    private static log(message: string, logLevel: 'error' | 'warn' | 'info', dumpObject?: any) {
        const logMessage = `\n[${moment().format('MM/DD/YYYY HH:MM:SS')}]  [${logLevel.toUpperCase()}]:     ${message} ${dumpObject?.message ?? ''}\n${dumpObject?.stack ?? ''}`;

        this.createLogDir();
        writeFileSync(`${this.logDir}/${this.logfile}`, logMessage, { flag: 'a' });

        if (Logger.showOnConsole) {
            switch(logLevel) {
                case 'warn': console.warn(message, dumpObject ? dumpObject : ''); break;
                case 'error': console.error(message, dumpObject ? dumpObject : ''); break;
                case 'info': console.info(message, dumpObject ? dumpObject : ''); break;
            }
        }
    }
}
