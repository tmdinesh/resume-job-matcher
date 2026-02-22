import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, X, Download, FileText, FileSpreadsheet, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { apiService } from '../services/api';
import type { Candidate } from '../types';
import { cn } from '../utils/cn';
import { Toast } from '../components/ui/toast';

export const Shortlist = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShortlisted = async () => {
      try {
        const data = await apiService.getShortlisted();
        setCandidates(data);
      } catch (error) {
        console.error('Failed to fetch shortlisted candidates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShortlisted();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await apiService.removeFromShortlist(id);
      setCandidates(prev => prev.filter(c => c.id !== id));
      setToast({ message: 'Removed from shortlist', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to remove from shortlist', type: 'error' });
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    setExporting(format);
    try {
      const blob = await apiService.exportReport('shortlist', format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shortlist_report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setToast({ message: `Report exported as ${format.toUpperCase()}`, type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to export report', type: 'error' });
    } finally {
      setExporting(null);
    }
  };

  if (loading) {
    return <div className="space-y-6">Loading shortlist...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shortlist</h1>
          <p className="text-gray-500 mt-1">Your selected candidates ({candidates.length})</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={candidates.length === 0 || exporting !== null}
          >
            {exporting === 'pdf' ? (
              'Exporting...'
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            disabled={candidates.length === 0 || exporting !== null}
          >
            {exporting === 'excel' ? (
              'Exporting...'
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </>
            )}
          </Button>
        </div>
      </div>

      {candidates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No candidates in shortlist</p>
            <Button variant="outline" onClick={() => navigate('/candidates')}>
              Browse Candidates
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <CardDescription>{candidate.id}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(candidate.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Match Score</span>
                    <span className={cn("text-sm font-semibold", {
                      "text-green-600": candidate.matchScore >= 80,
                      "text-yellow-600": candidate.matchScore >= 60 && candidate.matchScore < 80,
                      "text-orange-600": candidate.matchScore >= 40 && candidate.matchScore < 60,
                      "text-red-600": candidate.matchScore < 40,
                    })}>
                      {candidate.matchScore}%
                    </span>
                  </div>
                  <Progress value={candidate.matchScore} />
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Experience</p>
                  <p className="text-sm font-medium">{candidate.experience} years</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Top Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.topMatchedSkills.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="info" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/candidates/${candidate.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
