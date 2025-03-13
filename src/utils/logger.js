import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty", // Format logs to make them more readable
    options: {
      colorize: true, // Colors in the terminal
    },
  },
});

export default logger;
