import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { apiService } from '../services/api';
import type { Candidate } from '../types';
import { cn } from '../utils/cn';

type FilterType = 'All' | 'Strong' | 'Medium' | 'Weak' | 'Reject';
type SortType = 'score' | 'experience' | 'name';
type SortOrder = 'asc' | 'desc';

export const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState<FilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await apiService.getCandidates();
        setCandidates(data);
        setFilteredCandidates(data);
      } catch (error) {
        console.error('Failed to fetch candidates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    let filtered = candidates;

    // Apply filter
    if (filter !== 'All') {
      filtered = filtered.filter(c => c.recommendation === filter);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.topMatchedSkills.some(skill => skill.toLowerCase().includes(query)) ||
          c.id.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'score':
          comparison = a.matchScore - b.matchScore;
          break;
        case 'experience':
          comparison = a.experience - b.experience;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredCandidates(filtered);
  }, [candidates, filter, searchQuery, sortBy, sortOrder]);

  const handleSort = (field: SortType) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'Strong':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Weak':
        return 'danger';
      case 'Reject':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const SortButton = ({ field, children }: { field: SortType; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-primary transition-colors"
    >
      {children}
      {sortBy === field ? (
        sortOrder === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="h-4 w-4 opacity-50" />
      )}
    </button>
  );

  if (loading) {
    return <div className="space-y-6">Loading candidates...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Candidates</h1>
        <p className="text-muted-foreground mt-2">Review and rank all candidates</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name, email, skills, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['All', 'Strong', 'Medium', 'Weak', 'Reject'] as FilterType[]).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCandidates.length} of {candidates.length} candidates
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <SortButton field="name">Candidate ID</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <SortButton field="score">Match Score</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <SortButton field="experience">Experience</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Top Matched Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Missing Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recommendation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No candidates found
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-foreground">{candidate.id}</div>
                          <div className="text-sm text-muted-foreground">{candidate.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-[100px]">
                            <Progress value={candidate.matchScore} />
                          </div>
                          <span className={cn("text-sm font-semibold min-w-[40px]", {
                            "text-green-600": candidate.matchScore >= 80,
                            "text-yellow-600": candidate.matchScore >= 60 && candidate.matchScore < 80,
                            "text-orange-600": candidate.matchScore >= 40 && candidate.matchScore < 60,
                            "text-red-600": candidate.matchScore < 40,
                          })}>
                            {candidate.matchScore}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {candidate.experience} years
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.topMatchedSkills.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant="info" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.topMatchedSkills.length > 3 && (
                            <Badge variant="info" className="text-xs">
                              +{candidate.topMatchedSkills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.missingSkills.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="warning" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.missingSkills.length > 2 && (
                            <Badge variant="warning" className="text-xs">
                              +{candidate.missingSkills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getRecommendationColor(candidate.recommendation)}>
                          {candidate.recommendation}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/candidates/${candidate.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
