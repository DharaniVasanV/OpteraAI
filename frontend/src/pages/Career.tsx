import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Briefcase, Zap, Cpu, List, Target, FileText, User, ExternalLink } from 'lucide-react';

type Tab = 'career' | 'resumes';

export default function Career() {
  const [tab, setTab] = useState<Tab>('career');
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingCareer, setLoadingCareer] = useState(true);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => { fetchAnalyses(); fetchResumes(); }, []);

  const fetchAnalyses = async () => {
    try {
      const res = await axios.get('/api/career/analyses');
      const data = Array.isArray(res.data) ? res.data : [res.data];
      const sorted = data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setAnalyses(sorted.slice(0, 3)); // Show latest 3
    } catch (e) { console.error(e); }
    finally { setLoadingCareer(false); }
  };

  const fetchResumes = async () => {
    try {
      const res = await axios.get('/api/resume/list');
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setResumes(data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5));
    } catch (e) { console.error(e); }
    finally { setLoadingResumes(false); }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20';
    if (score >= 50) return 'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20';
    return 'text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-900/20';
  };

  const createLearningPlan = async (analysis: any) => {
    try {
      const sd = analysis.structured_data || {};
      const missingSkills: string[] = sd.skill_gap || sd.skills?.missing || [];
      const prompt = `Based on the career analysis, the missing skills are: ${missingSkills.join(', ') || 'general software engineering skills'}. Create a personalized 12-step learning plan.`;
      const res = await axios.post('/api/learning/create', { prompt, experience_level: 'intermediate' });
      if (res.data?.status === 'failed') {
          throw new Error(res.data.reason || 'Verification failure or rate limit.');
      }
      alert('Learning plan created! Check the Learning Mentor module.');
    } catch (err: any) { 
        console.error(err);
        alert(`Failed to create learning plan: ${err.message || 'Server error'}`); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-10 h-10 text-emerald-600" />
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Career Intelligence
          </h1>
          <p className="text-[#64748B] dark:text-[#A1A1AA] font-medium">AI-powered ATS scoring & skill gap analysis.</p>
        </div>
      </div>

      <div className="space-y-8">
        {loadingCareer ? (
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-[#EFF6FF] dark:bg-[#18181B] rounded-xl"></div>
            <div className="h-64 bg-[#EFF6FF] dark:bg-[#18181B] rounded-xl"></div>
          </div>
        ) : analyses.length > 0 ? analyses.map((analysis, idx) => {
          const data = analysis.structured_data || {};
          const ats = data.ats || { score: analysis.ats_score || 0, breakdown: {} };
          const emp = data.employability_score || analysis.employability_score || 0;
          const { technical = [], missing = [] } = data.skills || {};
          const skillGap: string[] = missing.length > 0 ? missing : (data.skill_gap || []);

          return (
            <div key={analysis.id || idx} className="bg-white dark:bg-[#18181B] border border-[#DCE3ED] dark:border-[#2A2D33] rounded-2xl shadow-xl">
              <div className="p-6 bg-white dark:bg-[#18181B] border border-[#DCE3ED] dark:border-[#2A2D33] shadow-sm/50 border-b border-[#DCE3ED] dark:border-[#2A2D33] flex justify-between items-start flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <User className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-2xl font-bold">{data.profile?.name || analysis.user_name || 'Candidate'}</h2>
                    <span className="text-xs font-normal px-2 py-0.5 bg-[#EFF6FF] dark:bg-[#18181B] rounded text-[#64748B] dark:text-[#A1A1AA] font-medium">
                      {new Date(analysis.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-[#64748B] dark:text-[#A1A1AA] font-medium max-w-2xl text-sm leading-relaxed">
                    {data.career_summary || analysis.career_summary || 'No summary available.'}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className={`p-4 rounded-xl border flex flex-col items-center min-w-[90px] ${getScoreColor(ats.score)}`}>
                    <span className="text-[10px] uppercase font-bold opacity-80 mb-1">ATS Score</span>
                    <span className="text-3xl font-black">{ats.score}%</span>
                  </div>
                  <div className={`p-4 rounded-xl border flex flex-col items-center min-w-[90px] ${getScoreColor(emp)}`}>
                    <span className="text-[10px] uppercase font-bold opacity-80 mb-1">Employability</span>
                    <span className="text-3xl font-black">{emp}%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Skills */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold flex items-center gap-2 text-indigo-600"><Cpu className="w-4 h-4"/> Skill Matrix</h3>
                  <div>
                    <p className="text-[10px] text-[#94A3B8] dark:text-[#71717A] font-semibold uppercase mb-2">Technical Stack</p>
                    <div className="flex flex-wrap gap-1.5">{technical.length > 0 ? technical.map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded text-xs border border-indigo-200 dark:border-indigo-700">{s}</span>
                    )) : <span className="text-[#94A3B8] text-xs">None detected</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-rose-500 uppercase font-bold mb-2 mt-3">Missing / Skill Gaps</p>
                    <div className="flex flex-wrap gap-1.5">{skillGap.length > 0 ? skillGap.map((s: any, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded text-xs border border-rose-200 dark:border-rose-800">{typeof s === 'string' ? s : JSON.stringify(s)}</span>
                    )) : <span className="text-[#94A3B8] text-xs">None identified</span>}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold flex items-center gap-2 text-amber-600"><Target className="w-4 h-4"/> Recommendations</h3>
                  <div className="bg-white dark:bg-[#18181B] border border-[#DCE3ED] dark:border-[#2A2D33] p-3 rounded-lg overflow-y-auto max-h-64">
                    <ul className="space-y-2">
                      {data.recommendations?.slice(0, 8).map((rec: string, i: number) => (
                        <li key={i} className="flex gap-2 text-xs text-[#111827] dark:text-[#F5F5F5] font-bold leading-relaxed"><span className="text-amber-600 mt-0.5 shrink-0">→</span>{rec}</li>
                      ))}
                      {(!data.recommendations || data.recommendations.length === 0) && (
                        <p className="text-[#94A3B8] dark:text-[#71717A] font-semibold text-xs">No specific recommendations.</p>
                      )}
                    </ul>
                  </div>
                </div>

                {/* ATS + CTA */}
                <div className="flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold flex items-center gap-2 text-emerald-600 mb-3"><List className="w-4 h-4"/> ATS Breakdown</h3>
                    <div className="space-y-2">
                      {Object.entries(ats.breakdown || {}).map(([key, val]: any) => (
                        <div key={key}>
                          <div className="flex justify-between text-[10px] mb-1 text-[#64748B] dark:text-[#A1A1AA] font-medium">
                            <span className="capitalize">{key.replace(/_/g, ' ')}</span><span>{val}%</span>
                          </div>
                          <div className="h-1 w-full bg-[#EFF6FF] dark:bg-[#18181B] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${val}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => createLearningPlan(analysis)}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-all text-sm mt-2"
                  >
                    <Zap className="w-4 h-4" /> Auto-Generate Learning Path
                  </button>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="glass-card p-12 text-center text-[#94A3B8] dark:text-[#71717A] font-semibold rounded-xl border border-dashed border-[#DCE3ED] dark:border-[#2A2D33]">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No career analyses found.</p>
            <p className="text-sm mt-2">Go to Resume module → upload → click "Pass to Career Agent".</p>
          </div>
        )}
      </div>
    </div>
  );
}
