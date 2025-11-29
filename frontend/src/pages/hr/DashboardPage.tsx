import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Plus, TrendingUp } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { jobsApi } from '../../services/api';
import type { Job } from '../../types';
import { useAuth } from '../../hooks/useAuth';

function DashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobsApi.list();
      setJobs(data.jobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalApplications = jobs.reduce((sum, job) => sum + (job.applications_count || 0), 0);
  const activeJobs = jobs.filter((job) => job.status === 'published').length;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back{user?.company_name ? `, ${user.company_name}` : ''}!
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your job postings.</p>
          </div>
          <Link to="/jobs/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Job
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-light rounded-lg">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold">{activeJobs}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold">{totalApplications}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Jobs */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Jobs</h2>
            <Link to="/jobs" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </Card>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <Card className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
              <p className="text-gray-600 mb-4">Create your first job to start receiving applications.</p>
              <Link to="/jobs/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Job
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.slice(0, 4).map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}`}>
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <Badge
                        variant={job.status === 'published' ? 'success' : 'warning'}
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mb-3">
                      {job.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="default">{skill}</Badge>
                      ))}
                      {job.skills.length > 3 && (
                        <Badge variant="default">+{job.skills.length - 3}</Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {job.applications_count || 0} candidates
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default DashboardPage;
