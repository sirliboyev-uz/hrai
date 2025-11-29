import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Briefcase } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { jobsApi } from '../../services/api';
import type { Job } from '../../types';

function JobsPage() {
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <Link to="/jobs/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Job
            </Button>
          </Link>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{job.title}</h3>
                    <Badge
                      variant={job.status === 'published' ? 'success' : 'warning'}
                    >
                      {job.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="default">{skill}</Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <Badge variant="default">+{job.skills.length - 3}</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {job.applications_count || 0} candidates
                    </div>
                    <span>{job.min_experience}+ years</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default JobsPage;
