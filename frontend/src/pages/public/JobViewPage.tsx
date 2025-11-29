import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bot, Briefcase, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { publicApi } from '../../services/api';
import type { JobPublic } from '../../types';

function JobViewPage() {
  const { publicLink } = useParams<{ publicLink: string }>();
  const [job, setJob] = useState<JobPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publicLink) {
      loadJob();
    }
  }, [publicLink]);

  const loadJob = async () => {
    try {
      const data = await publicApi.getJob(publicLink!);
      setJob(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Job not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Briefcase className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
        <p className="text-gray-600 text-center mb-4">
          {error || 'The job you are looking for does not exist or is no longer accepting applications.'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">HR AI</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
          {job.company_name && (
            <p className="text-lg text-gray-600 mb-4">at {job.company_name}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.min_experience}+ years experience
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">About the Role</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Requirements</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{job.requirements}</p>
          </div>

          <div className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="info">{skill}</Badge>
              ))}
            </div>
          </div>

          <Link to={`/job/${publicLink}/apply`}>
            <Button className="w-full" size="lg">
              Apply for this Job
            </Button>
          </Link>
        </Card>
      </main>
    </div>
  );
}

export default JobViewPage;
