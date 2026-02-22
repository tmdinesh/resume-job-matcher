import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { apiService } from '../services/api';
import { Toast } from '../components/ui/toast';

export const Upload = () => {
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [jdUploading, setJdUploading] = useState(false);
  const [resumesUploading, setResumesUploading] = useState(false);
  const [jdUploaded, setJdUploaded] = useState(false);
  const [resumesUploaded, setResumesUploaded] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const navigate = useNavigate();

  const handleJdFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('word'))) {
      setJdFile(file);
    }
  }, []);

  const handleResumeFilesDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || file.type.includes('word')
    );
    setResumeFiles(prev => [...prev, ...files]);
  }, []);

  const handleJdFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setJdFile(file);
  };

  const handleResumeFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setResumeFiles(prev => [...prev, ...files]);
  };

  const removeResumeFile = (index: number) => {
    setResumeFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleJdUpload = async () => {
    if (!jdFile && !jdText.trim()) {
      setToast({ message: 'Please upload a file or enter JD text', type: 'error' });
      return;
    }

    setJdUploading(true);
    try {
      const content = jdFile || jdText;
      await apiService.uploadJD(content as File | string);
      setJdUploaded(true);
      setToast({ message: 'Job Description uploaded successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to upload JD', type: 'error' });
    } finally {
      setJdUploading(false);
    }
  };

  const handleResumesUpload = async () => {
    if (resumeFiles.length === 0) {
      setToast({ message: 'Please select at least one resume', type: 'error' });
      return;
    }

    setResumesUploading(true);
    try {
      await apiService.uploadResumes(resumeFiles);
      setResumesUploaded(true);
      setToast({ message: `Successfully uploaded ${resumeFiles.length} resume(s)!`, type: 'success' });
      setTimeout(() => {
        navigate('/candidates');
      }, 2000);
    } catch (error) {
      setToast({ message: 'Failed to upload resumes', type: 'error' });
    } finally {
      setResumesUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload</h1>
        <p className="text-gray-500 mt-1">Upload job description and candidate resumes</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* JD Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Job Description</CardTitle>
            <CardDescription>Upload PDF or DOCX file, or paste text directly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDrop={handleJdFileDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
            >
              {jdFile ? (
                <div className="space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-blue-600" />
                  <p className="font-medium">{jdFile.name}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setJdFile(null)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Drag and drop JD file here, or{' '}
                    <label className="text-blue-600 hover:underline cursor-pointer">
                      browse
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleJdFileSelect}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job description text here..."
              className="w-full min-h-[200px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!!jdFile}
            />

            <Button
              onClick={handleJdUpload}
              disabled={jdUploading || jdUploaded || (!jdFile && !jdText.trim())}
              className="w-full"
            >
              {jdUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : jdUploaded ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Uploaded
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload JD
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resumes Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Multiple Resumes</CardTitle>
            <CardDescription>Upload multiple candidate resumes at once</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDrop={handleResumeFilesDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
            >
              <UploadIcon className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-sm text-gray-600 mt-2">
                Drag and drop resume files here, or{' '}
                <label className="text-blue-600 hover:underline cursor-pointer">
                  browse
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={handleResumeFilesSelect}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB each</p>
            </div>

            {resumeFiles.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {resumeFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResumeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleResumesUpload}
              disabled={resumesUploading || resumesUploaded || resumeFiles.length === 0}
              className="w-full"
            >
              {resumesUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing {resumeFiles.length} resume(s)...
                </>
              ) : resumesUploaded ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Uploaded - Redirecting...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload {resumeFiles.length > 0 ? `${resumeFiles.length} ` : ''}Resumes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
