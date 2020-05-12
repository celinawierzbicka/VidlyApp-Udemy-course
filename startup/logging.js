const winston = require('winston');
require('express-async-errors');

module.exports = function () {
    process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    });
    
    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    
    });
    
    winston.configure({
        transports: [
            new winston.transports.File({ 
                filename: 'logfile.log' 
            })]
    });
}