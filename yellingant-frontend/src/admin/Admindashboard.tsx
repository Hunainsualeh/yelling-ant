import React, { useState, useEffect } from 'react';
import { Sidebar, StatsCard, RecentActivityItem, PerformanceCard, DashboardHeader, MonthSelect } from '../components';
import { request } from '../utils/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalPlays: 0,
    pendingQuizzes: 0
  });
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
  const [topQuizzes, setTopQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all quizzes for stats
        const data = await request('/api/admin/quiz?limit=100');
        const quizzes = data.quizzes || [];
        
        const published = quizzes.filter((q: any) => q.status === 'published');
        const drafts = quizzes.filter((q: any) => q.status === 'draft');
        
        setStats({
          totalQuizzes: quizzes.length,
          activeQuizzes: published.length,
          totalPlays: 0, // Would need analytics endpoint
          pendingQuizzes: drafts.length
        });
        
        // Recent quizzes (last 4)
        setRecentQuizzes(quizzes.slice(0, 4));
        
        // Top quizzes (just use first 4 for now)
        setTopQuizzes(published.slice(0, 4));
      } catch (e) {
        console.error('Failed to fetch dashboard data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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
            value={loading ? '...' : stats.totalQuizzes.toLocaleString()}
            delta="0%"
            deltaType="neutral"
            subtitle="All time"
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

            value={loading ? '...' : stats.activeQuizzes.toLocaleString()}
            delta="0%"
            deltaType="neutral"
            subtitle="Published"
                        />

          <StatsCard
            title="Total Plays"
            value={loading ? '...' : stats.totalPlays.toLocaleString()}
            delta="0%"
            deltaType="neutral"
            subtitle="All time"
            icon={<img src="/pause.svg" alt="pause" className="w-[52px] h-[52px]" />}
            iconBgColor="bg-white"
          />

          <StatsCard
            title="Total Pending"
            value={loading ? '...' : stats.pendingQuizzes.toLocaleString()}
            delta="0%"
            deltaType="neutral"
            subtitle="Drafts"
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
              {loading ? (
                <div className="text-gray-500">Loadingg...</div>
              ) : recentQuizzes.length === 0 ? (
                <div className="text-gray-500">No quizzes yet</div>
              ) : (
                recentQuizzes.map((q) => (
                  <RecentActivityItem 
                    key={q.id}
                    title={q.title} 
                    typeLabel={q.quiz_data?.type || 'Quiz'} 
                    status={q.status === 'published' ? 'Published' : 'Draft'} 
                    plays={0} 
                  />
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-gotham text-[24px] font-medium text-[#202224] mb-3">Top Performing Quizzes</h2>
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="text-gray-500">Loading...</div>
              ) : topQuizzes.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PerformanceCard isCreate />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topQuizzes.slice(0, 2).map((q) => (
                      <PerformanceCard 
                        key={q.id}
                        title={q.title} 
                        questions={q.quiz_data?.questions?.length || 0} 
                        completions={0} 
                        percent={0} 
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topQuizzes.slice(2, 3).map((q) => (
                      <PerformanceCard 
                        key={q.id}
                        title={q.title} 
                        questions={q.quiz_data?.questions?.length || 0} 
                        completions={0} 
                        percent={0} 
                      />
                    ))}
                    <PerformanceCard isCreate />
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
