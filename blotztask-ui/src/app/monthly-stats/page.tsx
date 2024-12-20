'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import CountUp from 'react-countup';
import { fetchMonthlyStats } from '@/services/taskService';
import { MonthlyStatDTO } from '@/model/monthly-stats-dto';

export default function Monthlystats() {

  const [totalUncompleted, setTotalUncompleted] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [specificCompleted, setSpecificCompleted] = useState<{ Personal: number; Work: number; Academic: number }>({
    Personal: 0,
    Work: 0,
    Academic: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const stats: MonthlyStatDTO = await fetchMonthlyStats(year, month);

        const completed = stats.tasks.completed || {};
        const uncompleted = stats.tasks.uncompleted || {};

        const total = Object.values(completed).reduce((sum, val) => sum + val, 0) +
                      Object.values(uncompleted).reduce((sum, val) => sum + val, 0);

        const totalUncompletedCount = Object.values(uncompleted).reduce((sum, val) => sum + val, 0);

        const personal = completed.Personal ?? 0;
        const work = completed.Work ?? 0;
        const academic = completed.Academic ?? 0;


        setTotalUncompleted(totalUncompletedCount);
        setTotalTasks(total);
        setSpecificCompleted({ Personal: personal, Work: work, Academic: academic });

        console.log("Specific Completed Tasks:", { Personal: personal, Work: work, Academic: academic });
      } catch (error) {
        console.error('Failed to fetch monthly stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-5 md:items-center md:p-10">
        <div className="mt-1">
          <Image
            src="/assets/images/profileImage.png"
            alt="an incredible image"
            width={150}
            height={150}
          />
        </div>
        <div>
          <p className="pl-20 font-arial font-bold text-[40px] leading-[100px] tracking-[-0.41px] text-center text-secondary">
            You planned
            <span className="px-3 font-arial font-bold text-8xl text-center text-secondary">
              <CountUp end={totalTasks} />
            </span>
            tasks this month
          </p>
        </div>
      </div>
      <div className="w-full flex flex-row gap-2">
        <Card className="bg-completed w-1/2">
          <CardHeader className="flex items-center rounded-lg bg-secondary">
            <CardTitle className="text-completed text-4xl">Completed</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row text-3xl justify-center text-secondary">
            {Object.keys(specificCompleted).map((label, i) => (
              <div key={i} className="flex flex-row py-4">
                <div className="flex flex-col justify-center items-center px-10">
                  <span className="font-bold text-6xl">{specificCompleted[label]}</span>
                  <p className="capitalize">{label}</p>
                </div>
                {i < Object.keys(specificCompleted).length - 1 && (
                  <Separator orientation="vertical" className="border-2 border-secondary" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-unfinished w-1/2 text-white">
          <CardHeader className="flex items-center rounded-lg bg-unfinished-header">
            <CardTitle className="text-4xl">Unfinished</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row text-3xl justify-center">
            <div className="flex flex-col items-center py-4">
              <span className="font-bold text-6xl">{totalUncompleted}</span>
              <p className="capitalize">others</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
