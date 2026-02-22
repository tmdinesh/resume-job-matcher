import { useEffect, useState } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { apiService } from '../services/api';
import type { Report } from '../types';
import { Toast } from '../components/ui/toast';

export const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiService.getReports();
        setReports(data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDownload = async (report: Report, format: 'pdf' | 'excel') => {
    setDownloading(`${report.id}-${format}`);
    try {
      const blob = await apiService.exportReport(report.type, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name.replace(/\s+/g, '_')}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setToast({ message: `Report downloaded as ${format.toUpperCase()}`, type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to download report', type: 'error' });
    } finally {
      setDownloading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'shortlist_summary':
        return 'Shortlist Summary';
      case 'full_ranking':
        return 'Full Ranking';
      case 'bias_evaluation':
        return 'Bias Evaluation';
      default:
        return type;
    }
  };

  if (loading) {
    return <div className="space-y-6">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Generate and download recruitment reports</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {getReportTypeLabel(report.type)}
                  </CardDescription>
                </div>
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Generated {formatDate(report.dateGenerated)}</span>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDownload(report, 'pdf')}
                  disabled={downloading !== null}
                >
                  {downloading === `${report.id}-pdf` ? (
                    'Downloading...'
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDownload(report, 'excel')}
                  disabled={downloading !== null}
                >
                  {downloading === `${report.id}-excel` ? (
                    'Downloading...'
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1" />
                      Excel
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No reports available</p>
          </CardContent>
        </Card>
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
