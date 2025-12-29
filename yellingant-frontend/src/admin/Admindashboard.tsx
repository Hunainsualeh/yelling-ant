import React from 'react';
import { Sidebar, StatsCard, RecentActivityItem, PerformanceCard, DashboardHeader, MonthSelect } from '../components';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex">
      <Sidebar variant="admin" />

      <main className="flex-1 p-8">
        <DashboardHeader />

        <div className="mt-6 mb-4">
          <h1 className="text-[32px] font-gotham font-medium">Dashboard</h1>
          
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Quizzes"
            value="40,689"
            delta="8.5%"
            deltaType="up"
            subtitle="Up from past week"
            icon={<img src="/openbook.svg" alt="openbook" className="w-[52px] h-[52px]" />}
            iconBgColor="bg-white"
          />

          <StatsCard
            title="Active Quizzes"
            icon={
                <div className="relative w-[52px] h-[52px]">
                  <img src="/increamentgraph.svg" alt="graph" className="w-[52px] h-[52px]" />
                  <img src="/iconincreamentinner.svg" alt="inner" className="absolute left-1/2 top-3 transform -translate-x-1/2 w-[24px] h-[24px]" />
                </div>
              }
            iconBgColor="bg-white"

            value="10,293"
            delta="1.3%"
            deltaType="up"
            subtitle="Up from past week"
                        />

          <StatsCard
            title="Total Plays"
            value="$89,000"
            delta="-4.3%"
            deltaType="down"
            subtitle="Down from yesterday"
            icon={<img src="/pause.svg" alt="pause" className="w-[52px] h-[52px]" />}
            iconBgColor="bg-white"
          />

          <StatsCard
            title="Total Pending"
            value="2,040"
            delta="0%"
            deltaType="neutral"
            subtitle="From past two months"
            icon={<img src="/timer.svg" alt="timer" className="w-[52px] h-[52px]" />}
            iconBgColor="bg-white"
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm"> 
            <div className="flex items-start justify-between mb-3">
              <h2 className="font-gotham text-[24px] font-medium">Recent Quizzes</h2>
              <MonthSelect
                className="ml-4"
                value={undefined}
                onChange={(v) => {
                  /* TODO: wire filtering by month range */
                  console.log('Selected month range:', v);
                }}
              />
            </div>
            <div className="space-y-3">
              <RecentActivityItem title="Which Disney Princess Are You?" typeLabel="Personality" status="Published" plays="2,340" />
              <RecentActivityItem title="Ultimate Marvel Trivia Challenge" typeLabel="Trivia" status="Published" plays="1,876" />
              <RecentActivityItem title="Rate These Foods Poll" typeLabel="Poll" status="Published" plays="945" />
              <RecentActivityItem title="Pick Your Favorites" typeLabel="Image-Choice" status="Draft" plays={0} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-gotham text-[24px] font-medium text-[#202224] mb-3">Top Performing Quizzes</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PerformanceCard title="Introduction to Biology" questions={15} completions={28} percent={75} />
                <PerformanceCard title="Advanced Chemistry" questions={12} completions={22} percent={68} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PerformanceCard title="Introduction to Biology" questions={15} completions={28} percent={75} />
                <PerformanceCard isCreate />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
