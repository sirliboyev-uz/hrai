import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Users, Check, Mail, X, Download, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ScoreCircle from '../../components/ui/ScoreCircle';
import CandidateDetailModal from '../../components/candidates/CandidateDetailModal';
import { jobsApi, applicationsApi } from '../../services/api';
import type { Job, Application } from '../../types';

function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: false,
    requirements: false,
    skills: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [jobData, appsData] = await Promise.all([
        jobsApi.get(id!),
        applicationsApi.list(id!),
      ]);
      setJob(jobData);
      setApplications(appsData.applications);
    } catch (error) {
      toast.error('Failed to load job');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (job) {
      const link = `${window.location.origin}/job/${job.public_link}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAction = async (applicationId: string, action: string) => {
    try {
      await applicationsApi.action(applicationId, action);
      toast.success(`Candidate marked as ${action}`);
      setSelectedApplicationId(null);
      loadData();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleDownloadResume = async (applicationId: string) => {
    try {
      await applicationsApi.downloadResume(applicationId);
      toast.success('Resume downloaded');
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </button>

          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <Badge variant={job.status === 'published' ? 'success' : 'warning'}>
                  {job.status}
                </Badge>
              </div>
              <p className="text-gray-600">
                {job.min_experience}+ years experience required
              </p>
            </div>
            <Button variant="secondary" onClick={copyLink}>
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Public Link'}
            </Button>
          </div>
        </div>

        {/* Job Details - Accordion */}
        <div className="space-y-2">
          {/* Description Accordion */}
          <Card className="overflow-hidden">
            <button
              onClick={() => toggleSection('description')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors -m-4"
            >
              <h2 className="font-semibold text-gray-900">Description</h2>
              {openSections.description ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openSections.description && (
              <div className="pt-4 mt-4 border-t">
                <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
              </div>
            )}
          </Card>

          {/* Requirements Accordion */}
          <Card className="overflow-hidden">
            <button
              onClick={() => toggleSection('requirements')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors -m-4"
            >
              <h2 className="font-semibold text-gray-900">Requirements</h2>
              {openSections.requirements ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openSections.requirements && (
              <div className="pt-4 mt-4 border-t">
                <p className="text-gray-600 whitespace-pre-wrap">{job.requirements}</p>
              </div>
            )}
          </Card>

          {/* Required Skills Accordion */}
          <Card className="overflow-hidden">
            <button
              onClick={() => toggleSection('skills')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors -m-4"
            >
              <h2 className="font-semibold text-gray-900">Required Skills ({job.skills.length})</h2>
              {openSections.skills ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openSections.skills && (
              <div className="pt-4 mt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="info">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Applications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Candidates ({applications.length})</h2>
          </div>

          {applications.length === 0 ? (
            <Card className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-4">Share your job link with candidates to start receiving applications.</p>
              <Button onClick={copyLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Job Link
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((app, index) => (
                <Card key={app.id}>
                  <div className="flex items-start gap-4">
                    <div className="text-center">
                      <span className="text-sm text-gray-500">#{index + 1}</span>
                      <ScoreCircle score={Number(app.ai_score) || 0} size="md" />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3
                            className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                            onClick={() => setSelectedApplicationId(app.id)}
                          >
                            {app.candidate.full_name}
                          </h3>
                          <p className="text-sm text-gray-600">{app.candidate.email}</p>
                        </div>
                        <Badge
                          variant={
                            app.status === 'interview' ? 'success' :
                            app.status === 'reject' ? 'danger' :
                            'default'
                          }
                        >
                          {app.status}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        {app.candidate.years_of_experience
                          ? `${app.candidate.years_of_experience} years experience`
                          : 'Experience not specified'}
                        {' • '}
                        Applied {new Date(app.applied_at).toLocaleDateString()}
                      </div>

                      {app.score_breakdown && (
                        <div className="bg-gray-50 rounded p-3 mb-3 text-sm">
                          <div className="flex gap-4 mb-2">
                            <span>Skills: {app.score_breakdown.skills}%</span>
                            <span>Experience: {app.score_breakdown.experience}%</span>
                          </div>
                          {app.explanation && (
                            <p className="text-gray-600">{app.explanation}</p>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownloadResume(app.id)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                        {app.status === 'applied' && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleAction(app.id, 'interview')}
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              Interview
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleAction(app.id, 'reject')}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedApplicationId && (
        <CandidateDetailModal
          applicationId={selectedApplicationId}
          onClose={() => setSelectedApplicationId(null)}
          onAction={(action) => handleAction(selectedApplicationId, action)}
        />
      )}
    </Layout>
  );
}

export default JobDetailPage;
