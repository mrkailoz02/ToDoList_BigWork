import dayjs from "dayjs";

type dateUtils = {
  date?: dayjs.ConfigType;
};

type formatUtils = {
  format?: string;
};

type dateArrArg = dateUtils &
  formatUtils & {
    days: number;
    type?: "plus" | "minus";
  };

export const now = () => dayjs().locale("th").format("YYYY-MM-DD HH:mm:ss");

export const getMonthLength = ({ date }: dateUtils) => {
  let start = dayjs(date).startOf("month");
  let end = dayjs(date).add(1, "month").startOf("month");
  return end.diff(start, "days");
};

export const getDateArray = ({
  date,
  days,
  format = "YYYY-MM-DD",
  type = "plus",
}: dateArrArg) => {
  let startDate = dayjs(date);
  return Array.from({ length: days }, (_, i) =>
    type === "plus"
      ? startDate.add(i, "days").format(format)
      : startDate.subtract(i, "days").format(format)
  );
};
