import { format, timeFormat, timeParse } from "d3";

export const formatThousands = format(",");
export const formatPercentage = format(".0%");
export const formatDate = timeFormat("%m/%Y");
export const formatTwoDecimalPoints = (d) => parseFloat(d).toFixed(2);

export const parseDate = timeParse("%Y-%m-%d");
