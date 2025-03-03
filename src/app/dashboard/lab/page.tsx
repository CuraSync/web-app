"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../lab/sidebar/sidebar';

const LabDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalTests: 0, pendingReports: 0 });
  const [recentReports, setRecentReports] = useState<{ id: number; patient: string; test: string; status: string }[]>([]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'lab') {
      router.push('/auth/login/lab');
    } else {
      setIsLoading(false);
      fetchLabData();
    }
  }, [router]);

  const fetchLabData = async () => {
    // Replace with API call
    setTimeout(() => {
      setStats({ totalTests: 120, pendingReports: 8 });
      setRecentReports([
        { id: 1, patient: 'John Doe', test: 'Blood Test', status: 'Completed' },
        { id: 2, patient: 'Jane Smith', test: 'X-Ray', status: 'Pending' }
      ]);
    }, 1000);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Lab Dashboard</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">Total Tests Conducted</h2>
            <p className="text-2xl font-bold">{stats.totalTests}</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">Pending Reports</h2>
            <p className="text-2xl font-bold">{stats.pendingReports}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6">Recent Reports</h2>
        <div className="mt-2 bg-white p-4 shadow rounded-lg">
          {recentReports.length > 0 ? (
            <ul>
              {recentReports.map((report) => (
                <li key={report.id} className="py-2 border-b last:border-0">
                  {report.patient} - {report.test} ({report.status})
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent reports available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
