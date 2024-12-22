import { H1, H5 } from "@/components/ui/heading-with-anchor";
import React from "react";

const TodayHeader = () => {
  return (
    <div className="flex flex-col gap-5">
      <H1 className="heading-primary">
        Day<span className="heading-secondary">View</span>
      </H1>
      <H5>List of today&apos;s tasks</H5>
    </div>
  );
};

export default TodayHeader;