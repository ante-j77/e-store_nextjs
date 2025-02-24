import prisma from "@/prisma/client";
import moment from "moment";

export default async function getGraphData() {
  try {
    const startDate = moment().subtract(6, "days").startOf("day");
    const endDate = moment().endOf("day");

    const result = await prisma.order.groupBy({
      by: ["createdDate"],
      where: {
        createdDate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
        status: "complete",
      },

      _sum: {
        amount: true,
      },
    });

    const aggregatedData: {
      [day: string]: { day: string; date: string; totalAmount: number };
    } = {};

    const currentDate = startDate.clone();

    while (currentDate <= endDate) {
      const day = currentDate.format("dddd");
      console.log("day: ", day, currentDate);

      aggregatedData[day] = {
        day,
        date: currentDate.format("YYYY-DD-MM"),
        totalAmount: 0,
      };

      currentDate.add(1, "day");
    }

    result.forEach((entry) => {
      const day = moment(entry.createdDate).format("dddd");
      const amount = entry._sum.amount || 0;
      aggregatedData[day].totalAmount += amount;
    });

    const formattedData = Object.values(aggregatedData).sort((a, b) =>
      moment(a.date).diff(moment(b.date))
    );

    return formattedData;
  } catch (error: any) {
    throw new Error(error);
  }
}
