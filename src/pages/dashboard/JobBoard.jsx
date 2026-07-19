import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Briefcase, MapPin, Building, Clock, CheckCircle, Award, Code, AlertCircle, Trash2, X, Users, Mail } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

const JobBoard = () => {
  const { user, token } = useApp(); 
  const isRecruiter = user?.role === 'hr' || user?.role === 'recruiter';

  // --- RECRUITER STATE ---
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    title: '', company: '', location: '', type: 'Full-time', experience: '', skills: '' 
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // State for viewing applications
  const [viewingApplicationsFor, setViewingApplicationsFor] = useState(null);

  // --- CANDIDATE APPLY STATE ---
  const [applyingToJob, setApplyingToJob] = useState(null); 
  const [applyFormData, setApplyFormData] = useState({
    name: user?.name || '', 
    email: user?.email || '', // Auto-fills email from user context
    experience: '', 
    coverLetter: '' 
  });
  const [applySuccess, setApplySuccess] = useState(false);

  // Keep name & email updated if user context changes after mount
  useEffect(() => {
    if (user) {
      setApplyFormData(prev => ({ 
        ...prev, 
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  // Fetch jobs from the backend when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) return; 

      try {
        const response = await fetch(`${BASE_URL}/api/jobs`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const result = await response.json();
        if (result.success) {
          setJobs(result.data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  // --- RECRUITER HANDLERS ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return;

    setErrorMsg('');

    try {
      const response = await fetch(`${BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setJobs([result.data, ...jobs]);
        setFormData({ title: '', company: '', location: '', type: 'Full-time', experience: '', skills: '' });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setErrorMsg(result.message || 'Failed to post job');
      }
    } catch (error) {
      console.error("Error creating job:", error);
      setErrorMsg('Server error while posting job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;

    try {
      const response = await fetch(`${BASE_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setJobs(jobs.filter(job => job._id !== jobId));
        if (viewingApplicationsFor?._id === jobId) setViewingApplicationsFor(null);
      } else {
        alert(result.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert('Server error while deleting job');
    }
  };

  // --- CANDIDATE APPLY HANDLERS ---
  const openApplyModal = (job) => {
    setApplyingToJob(job);
    setApplySuccess(false);
  };

  const closeApplyModal = () => {
    setApplyingToJob(null);
    setApplyFormData(prev => ({ ...prev, experience: '', coverLetter: '' }));
  };

  const handleApplyInputChange = (e) => {
    setApplyFormData({ ...applyFormData, [e.target.name]: e.target.value });
  };

  // UPDATED: Now actually sends the request to the new backend route
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${BASE_URL}/api/jobs/${applyingToJob._id}/apply`, { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(applyFormData) 
      });

      const result = await response.json();

      if (result.success) {
        setApplySuccess(true);
        setTimeout(() => {
          closeApplyModal();
        }, 2000);
      } else {
        alert(result.message || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Server error while submitting application.");
    }
  };

  return (
    <div className="p-5 md:p-8 animate-fade-up space-y-8 relative">
      {/* Header */}
      <div className="border-b border-bdr pb-6">
        <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2 text-txt">
          <Briefcase className="w-6 h-6 text-brand" />
          {isRecruiter ? 'Recruitment Hub' : 'Job Board'}
        </h1>
        <p className="text-muted text-sm mt-2">
          {isRecruiter 
            ? 'Create job listings and review applicant profiles.' 
            : 'Browse opportunities and submit your applications.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RECRUITER ONLY: Post a Job Form */}
        {isRecruiter && (
          <div className="lg:col-span-5">
            <Card className="p-6 bg-card border-bdr">
              <h2 className="font-bold text-lg text-txt mb-4">Post a New Job</h2>
              
              {showSuccess && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400 text-sm font-bold">
                  <CheckCircle className="w-4 h-4" /> Job Posted Successfully!
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm font-bold">
                  <AlertCircle className="w-4 h-4" /> {errorMsg}
                </div>
              )}

              <form onSubmit={handlePostJob} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Job Title</label>
                  <input 
                    type="text" name="title" value={formData.title} onChange={handleInputChange} required
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-card2 border border-bdr2 rounded-lg px-3 py-2.5 text-sm text-txt focus:outline-none focus:border-brand"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Company Name</label>
                  <input 
                    type="text" name="company" value={formData.company} onChange={handleInputChange} required
                    placeholder="Your Company"
                    className="w-full bg-card2 border border-bdr2 rounded-lg px-3 py-2.5 text-sm text-txt focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Location</label>
                    <input 
                      type="text" name="location" value={formData.location} onChange={handleInputChange}
                      placeholder="Remote, NY, etc."
                      className="w-full bg-card2 border border-bdr2 rounded-lg px-3 py-2.5 text-sm text-txt focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Type</label>
                    <select 
                      name="type" value={formData.type} onChange={handleInputChange}
                      className="w-full bg-card2 border border-bdr2 rounded-lg px-3 py-2.5 text-sm text-txt focus:outline-none focus:border-brand"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Experience Requirement</label>
                    <input 
                      type="text" name="experience" value={formData.experience} onChange={handleInputChange}
                      placeholder="e.g. 2-4 Years"
                      className="w-full bg-card2 border border-bdr2 rounded-lg px-3 py-2.5 text-sm text-txt focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Required Skills</label>
                    <input 
                      type="text" name="skills" value={formData.skills} onChange={handleInputChange}
                      placeholder="React, Node.js..."
                      className="w-full bg-card2 border border-bdr2 rounded-lg px-3 py-2.5 text-sm text-txt focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-4">Publish Job</Button>
              </form>
            </Card>
          </div>
        )}

        {/* EVERYONE: Job Listings */}
        <div className={isRecruiter ? "lg:col-span-7" : "lg:col-span-8 lg:col-start-3"}>
          <h2 className="font-bold text-lg text-txt mb-4">
            {isRecruiter ? 'Active Postings' : 'Available Opportunities'}
          </h2>
          
          <div className="space-y-4">
            {isLoading ? (
              <Card className="p-8 text-center border-dashed text-muted animate-pulse">
                Loading jobs...
              </Card>
            ) : jobs.length === 0 ? (
              <Card className="p-8 text-center border-dashed text-muted">
                No jobs posted yet.
              </Card>
            ) : (
              jobs.map((job) => (
                <Card key={job._id} hover className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-bold text-txt text-lg">{job.title}</h3>
                    
                    {/* Basic Info */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted">
                      <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                    </div>

                    {/* Experience & Skills Display */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted font-medium">
                      {job.experience && (
                        <span className="flex items-center gap-1.5 bg-card2 px-2 py-1 rounded border border-bdr2 text-txt">
                          <Award className="w-3.5 h-3.5 text-brand" /> 
                          {job.experience}
                        </span>
                      )}
                      {job.skills && (
                        <span className="flex items-center gap-1.5 bg-card2 px-2 py-1 rounded border border-bdr2 text-txt">
                          <Code className="w-3.5 h-3.5 text-blue-400" /> 
                          {job.skills}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div>
                    {!isRecruiter ? (
                      <Button size="sm" onClick={() => openApplyModal(job)}>Easy Apply</Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge color="blue">Active</Badge>
                        
                        {/* Only show management buttons if the logged-in user posted it */}
                        {job.postedBy?._id === user?._id && (
                          <>
                            {/* View Applicants Button */}
                            <button 
                              onClick={() => setViewingApplicationsFor(job)}
                              className="p-2 text-brand hover:text-brand-lt hover:bg-brand/10 rounded transition-colors"
                              title="View Applicants"
                            >
                              <Users className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button 
                              onClick={() => handleDeleteJob(job._id)}
                              className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                              title="Delete Posting"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- RECRUITER VIEW APPLICATIONS MODAL --- */}
      {viewingApplicationsFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 bg-card border-bdr relative shadow-2xl">
            <button 
              onClick={() => setViewingApplicationsFor(null)}
              className="absolute top-4 right-4 text-muted hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-txt mb-1">Applicants</h2>
            <p className="text-sm text-brand font-medium mb-6">
              Role: {viewingApplicationsFor.title}
            </p>

            <div className="space-y-4">
              {/* Fallback rendering logic: Ensure backend populates job.applications array */}
              {viewingApplicationsFor.applications && viewingApplicationsFor.applications.length > 0 ? (
                viewingApplicationsFor.applications.map((app, index) => (
                  <div key={index} className="p-4 bg-card2 border border-bdr2 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-txt">{app.name}</h4>
                        <a href={`mailto:${app.email}`} className="text-sm text-muted flex items-center gap-1 hover:text-brand mt-1 transition-colors">
                          <Mail className="w-3.5 h-3.5" /> {app.email}
                        </a>
                      </div>
                      <Badge color="green">{app.experience} Yrs Exp</Badge>
                    </div>
                    <div className="text-sm text-txt mt-2">
                      <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">Cover Letter:</span>
                      <p className="bg-card p-3 rounded border border-bdr2 whitespace-pre-wrap">{app.coverLetter}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 border border-dashed border-bdr2 rounded-lg text-muted">
                  No applications received for this role yet.
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* --- CANDIDATE APPLICATION MODAL --- */}
      {applyingToJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="w-full max-w-md p-6 bg-card border-bdr relative shadow-2xl">
            <button 
              onClick={closeApplyModal}
              className="absolute top-4 right-4 text-muted hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-txt mb-1">Apply for Role</h2>
            <p className="text-sm text-brand font-medium mb-6">
              {applyingToJob.title} <span className="text-muted font-normal">at {applyingToJob.company}</span>
            </p>

            {applySuccess ? (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400 text-sm font-bold">
                <CheckCircle className="w-6 h-6 shrink-0" /> 
                Application submitted to {applyingToJob.company}!
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                
                {/* Auto-filled Name */}
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Full Name</label>
                  <input 
                    type="text" name="name" value={applyFormData.name} onChange={handleApplyInputChange} required readOnly
                    className="w-full bg-card2 border border-bdr2 rounded-lg px-3 py-2.5 text-sm text-txt focus:outline-none opacity-70 cursor-not-allowed"
                  />
                </div>

                {/* Auto-filled Email */}
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Email Address</label>
                  <input 
                    type="email" name="email" value={applyFormData.email} onChange={handleApplyInputChange} required readOnly
                    className="w-full bg-card2 border border-bdr2 rounded-lg px-3 py-2.5 text-sm text-txt focus:outline-none opacity-70 cursor-not-allowed"
                  />
                </div>
                
                {/* Experience */}
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Years of Experience</label>
                  <input 
                    type="number" name="experience" value={applyFormData.experience} onChange={handleApplyInputChange} required min="0"
                    placeholder="e.g. 3"
                    className="w-full bg-card2 border border-bdr2 rounded-lg px-3 py-2.5 text-sm text-txt focus:outline-none focus:border-brand"
                  />
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Cover Letter</label>
                  <textarea 
                    name="coverLetter" value={applyFormData.coverLetter} onChange={handleApplyInputChange} required rows="5"
                    placeholder="Why are you a great fit for this role?"
                    className="w-full bg-card2 border border-bdr2 rounded-lg px-3 py-2.5 text-sm text-txt focus:outline-none focus:border-brand resize-none"
                  />
                </div>

                <Button type="submit" className="w-full mt-2">Submit Application</Button>
              </form>
            )}
          </Card>
        </div>
      )}

    </div>
  );
};

export default JobBoard;