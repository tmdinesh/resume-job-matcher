import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, AlertCircle, XCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { apiService } from '../services/api';
import type { DashboardStats, Activity } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activitiesData] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getActivities(),
        ]);
        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) {
    return <div className="space-y-6">Loading...</div>;
  }

  const pieData = [
    { name: 'Strong Fit', value: stats.strongFit, color: COLORS[0] },
    { name: 'Medium Fit', value: stats.mediumFit, color: COLORS[1] },
    { name: 'Weak Fit', value: stats.weakFit, color: COLORS[2] },
  ];

  const skillsData = [
    { skill: 'Python', count: 8 },
    { skill: 'React', count: 7 },
    { skill: 'Node.js', count: 6 },
    { skill: 'TypeScript', count: 6 },
    { skill: 'AWS', count: 5 },
    { skill: 'Docker', count: 5 },
    { skill: 'MongoDB', count: 4 },
    { skill: 'PostgreSQL', count: 4 },
    { skill: 'GraphQL', count: 3 },
    { skill: 'Kubernetes', count: 3 },
  ];

  const scoreDistribution = [
    { range: '0-20', count: 0 },
    { range: '21-40', count: 1 },
    { range: '41-60', count: 2 },
    { range: '61-80', count: 4 },
    { range: '81-100', count: 3 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'resume_uploaded':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'jd_processed':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'candidate_shortlisted':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your recruitment analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="hover:shadow-soft-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Candidates</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground mt-1">Active profiles</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-soft-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Strong Fit</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.strongFit}</div>
            <p className="text-xs text-muted-foreground mt-1">High match score</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-soft-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Medium Fit</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.mediumFit}</div>
            <p className="text-xs text-muted-foreground mt-1">Moderate match</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-soft-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weak / Reject</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.weakFit}</div>
            <p className="text-xs text-muted-foreground mt-1">Low match score</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-soft-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Match Score</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.averageMatchScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Overall average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Fit Distribution</CardTitle>
            <CardDescription>Candidate match categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top 10 Skills</CardTitle>
            <CardDescription>Most common skills across candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={skillsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Match score ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your recruitment pipeline</CardDescription>
          </div>
          <Link to="/candidates" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors group">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
