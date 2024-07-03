import { useEffect, useRef } from "react";

import { ChartProps, data } from "@/components/charts/types";
import { getDatesInRange } from "@/components/charts/utils";

const DataFrequencySection: React.FC<ChartProps> = ({ data, filters }) => {
  const total = getDatesInRange(filters.startDate, filters.endDate).length;
  const surfed = data.length;
  const totalSessions = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div>
      <div className="text-2xl text-slate-500">Surf Frequency</div>
      <div className="flex gap-4">
        <div className="text-slate-600 text-bold">Total sessions: </div>
        <div className="text-bold">{totalSessions}</div>
      </div>
      <div className="flex gap-4">
        <div className="text-slate-600 text-bold">Days Surfed: </div>
        <div className="text-bold">
          {parseFloat((surfed / total).toFixed(2)) * 100}% ({surfed} Days)
        </div>
      </div>
      <div className="flex gap-4">
        <div className="text-slate-600 text-bold">Days Skiped: </div>
        <div className="text-bold">
          {parseFloat(((total - surfed) / total).toFixed(2)) * 100}% ({total - surfed} Days)
        </div>
      </div>
      <div className="flex">
        <div className="text-slate-600 text-bold">
          You are surfing on average {Math.floor((totalSessions / total) * 7)} days per week!
        </div>
      </div>
    </div>
  );
};

export default DataFrequencySection;
