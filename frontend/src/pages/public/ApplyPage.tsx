import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bot, Upload, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { publicApi } from '../../services/api';
import type { JobPublic } from '../../types';

function ApplyPage() {
  const { publicLink } = useParams<{ publicLink: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [job, setJob] = useState<JobPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    years_of_experience: '',
  });

  useEffect(() => {
    if (publicLink) {
      loadJob();
    }
  }, [publicLink]);

  const loadJob = async () => {
    try {
      const data = await publicApi.getJob(publicLink!);
      setJob(data);
    } catch (err) {
      toast.error('Job not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      // Validate file size (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please upload your resume');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('full_name', form.full_name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('years_of_experience', form.years_of_experience);
      formData.append('resume', file);

      await publicApi.submitApplication(publicLink!, formData);
      navigate(`/job/${publicLink}/success`);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to submit application');
    } finally {
      setSubmitting(false);
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

  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">HR AI</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Apply for: {job.title}</h1>
          {job.company_name && (
            <p className="text-gray-600">at {job.company_name}</p>
          )}
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="John Smith"
            />

            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@email.com"
            />

            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+998 90 123 4567"
            />

            <Input
              label="Years of Experience"
              type="number"
              min="0"
              required
              value={form.years_of_experience}
              onChange={(e) => setForm({ ...form, years_of_experience: e.target.value })}
              placeholder="5"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume <span className="text-red-500">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="flex items-center gap-3 p-4 border border-gray-300 rounded bg-gray-50">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">Drop your resume here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                    <p className="text-xs text-gray-400 mt-2">PDF, DOC, DOCX (max 5MB)</p>
                  </div>
                </button>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" loading={submitting}>
              Submit Application
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}

export default ApplyPage;
