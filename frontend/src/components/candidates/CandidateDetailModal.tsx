import { useState, useEffect } from 'react';
import { X, Download, Mail, Phone, Briefcase, CheckCircle, XCircle, AlertCircle, Sparkles, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ScoreCircle from '../ui/ScoreCircle';
import { applicationsApi } from '../../services/api';
import type { ApplicationDetail } from '../../types';

interface CandidateDetailModalProps {
  applicationId: string;
  onClose: () => void;
  onAction: (action: string) => void;
}

function CandidateDetailModal({ applicationId, onClose, onAction }: CandidateDetailModalProps) {
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      const data = await applicationsApi.get(applicationId);
      setApplication(data);
      setNotes(data.notes || '');
    } catch (error) {
      toast.error('Failed to load candidate details');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    try {
      await applicationsApi.downloadResume(applicationId);
      toast.success('Resume downloaded');
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await applicationsApi.updateNotes(applicationId, notes);
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!application) return null;

  const { candidate, score_breakdown } = application;
  const isAIPowered = score_breakdown?.ai_powered;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">{candidate.full_name}</h2>
              <Badge
                variant={
                  application.status === 'interview' ? 'success' :
                  application.status === 'reject' ? 'danger' :
                  application.status === 'hire' ? 'success' :
                  'default'
                }
              >
                {application.status}
              </Badge>
              {isAIPowered && (
                <Badge variant="info" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Analyzed
                </Badge>
              )}
            </div>
            <p className="text-gray-600 mt-1">
              Applied {new Date(application.applied_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Score & Contact */}
            <div className="space-y-6">
              {/* AI Score */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-gray-700 mb-3">AI Match Score</h3>
                <ScoreCircle score={Number(application.ai_score) || 0} size="lg" />
                {score_breakdown && (
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Skills Match</span>
                      <span className="font-medium">{score_breakdown.skills}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">{score_breakdown.experience}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline">
                      {candidate.email}
                    </a>
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${candidate.phone}`} className="text-blue-600 hover:underline">
                        {candidate.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {candidate.years_of_experience
                        ? `${candidate.years_of_experience} years experience`
                        : 'Experience not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resume Download */}
              <Button onClick={handleDownloadResume} variant="secondary" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </div>

            {/* Right Column - Analysis & Notes */}
            <div className="md:col-span-2 space-y-6">
              {/* AI Explanation */}
              {application.explanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">AI Analysis Summary</h3>
                  <p className="text-sm text-blue-800">{application.explanation}</p>
                </div>
              )}

              {/* Skills Match */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched Skills */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <h3 className="text-sm font-medium text-green-900">Matched Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {application.matched_skills.length > 0 ? (
                      application.matched_skills.map((skill, idx) => (
                        <Badge key={idx} variant="success">{skill}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-green-700">No skills matched</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <h3 className="text-sm font-medium text-red-900">Missing Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {application.missing_skills.length > 0 ? (
                      application.missing_skills.map((skill, idx) => (
                        <Badge key={idx} variant="danger">{skill}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-red-700">All skills matched!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Strengths & Concerns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                {application.strengths.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <h3 className="text-sm font-medium text-gray-900">Strengths</h3>
                    </div>
                    <ul className="space-y-2">
                      {application.strengths.map((strength, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">+</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Concerns */}
                {application.concerns.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <h3 className="text-sm font-medium text-gray-900">Concerns</h3>
                    </div>
                    <ul className="space-y-2">
                      {application.concerns.map((concern, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-yellow-500 mt-1">!</span>
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Parsed Resume Skills */}
              {application.resume_parsed?.skills && application.resume_parsed.skills.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Resume Skills (Extracted)</h3>
                  <div className="flex flex-wrap gap-2">
                    {application.resume_parsed.skills.map((skill, idx) => (
                      <Badge key={idx} variant="default">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* HR Notes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">HR Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this candidate..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {application.status === 'applied' && (
          <div className="border-t p-4 flex justify-end gap-3">
            <Button
              variant="danger"
              onClick={() => onAction('reject')}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              variant="success"
              onClick={() => onAction('interview')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Invite to Interview
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateDetailModal;
