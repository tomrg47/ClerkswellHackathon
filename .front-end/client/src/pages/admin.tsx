import Layout from "@/components/Layout";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Search, Filter, Download, Lock, ArrowRight, ArrowLeft, Calendar, CheckCircle2, Clock, AlertTriangle, QrCode } from "lucide-react";
import { useState } from "react";

// Mock Data
const FAMILIES = [
  { 
    id: 1, 
    name: "Sarah J.", 
    category: "Housing", 
    urgency: "Hours", 
    priority: "High",
    status: "Active",
    lastContact: "2 mins ago", 
    flags: ["risk_homeless"],
    engagement: ["Housing Support", "Dignity Supermarket"],
    history: [
      { date: "Nov 28, 10:30 AM", type: "Check-in", note: "Reported landlord notice (Section 21). Urgent housing advice needed." },
      { date: "Nov 28, 10:35 AM", type: "System", note: "Flagged as High Priority due to homelessness risk." },
      { date: "Oct 12, 2:00 PM", type: "Service", note: "Visited Dignity Supermarket. Purchased weekly essentials." },
      { date: "Sep 15, 11:00 AM", type: "Event", note: "Attended 'Back to School' coffee morning." }
    ]
  },
  { 
    id: 2, 
    name: "Mike T.", 
    category: "Food", 
    urgency: "Hours", 
    priority: "High",
    status: "New",
    lastContact: "15 mins ago", 
    flags: [],
    engagement: ["Emergency Food"],
    history: [
      { date: "Nov 28, 10:15 AM", type: "Check-in", note: "Requested emergency food support. No food in house." }
    ]
  },
  { 
    id: 3, 
    name: "Family A.", 
    category: "Income", 
    urgency: "Days", 
    priority: "Medium",
    status: "Active",
    lastContact: "1 day ago", 
    flags: ["children_in_household"],
    engagement: ["Benefits Advice", "Kids Club"],
    history: [
      { date: "Nov 27, 3:00 PM", type: "Check-in", note: "Struggling with utility bills." },
      { date: "Nov 20, 4:00 PM", type: "Event", note: "Children attended After School Kids Club." }
    ]
  },
  { 
    id: 4, 
    name: "Anon #492", 
    category: "Safety", 
    urgency: "Hours", 
    priority: "Critical",
    status: "Escalated",
    lastContact: "2 days ago", 
    flags: ["domestic_violence_risk"],
    engagement: ["Safety Planning"],
    history: [
      { date: "Nov 26, 9:00 PM", type: "Alert", note: "Safety risk flagged. Signposted to DV hotline." }
    ]
  },
  { 
    id: 5, 
    name: "David B.", 
    category: "Health", 
    urgency: "Weeks", 
    priority: "Low",
    status: "Monitoring",
    lastContact: "5 days ago", 
    flags: ["elderly_vulnerable"],
    engagement: ["Silver Coffee Morning"],
    history: [
      { date: "Nov 23, 11:00 AM", type: "Event", note: "Attended Silver Coffee Morning. Connected with volunteer team." }
    ]
  },
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<typeof FAMILIES[0] | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-primary mb-2">Staff Portal Access</h1>
              <p className="text-gray-600 font-sans text-sm">Please sign in to access sensitive case data.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded text-center">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-primary text-white py-3 rounded font-heading font-bold uppercase tracking-wide hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-4"
              >
                Access Portal <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  if (selectedFamily) {
    return (
      <Layout>
        <div className="w-full max-w-7xl mx-auto py-10 px-4">
          <button 
            onClick={() => setSelectedFamily(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 font-bold text-sm uppercase tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Families
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar Profile */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-heading font-bold">
                    {selectedFamily.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-heading font-bold text-primary">{selectedFamily.name}</h1>
                    <p className="text-sm text-gray-500">Family ID: #{selectedFamily.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Status</label>
                    <span className={cn(
                      "px-3 py-1 text-sm font-bold rounded-full inline-block",
                      selectedFamily.status === 'Active' ? "bg-green-100 text-green-700" :
                      selectedFamily.status === 'New' ? "bg-blue-100 text-blue-700" :
                      selectedFamily.status === 'Escalated' ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {selectedFamily.status}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Priority Level</label>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-bold",
                        selectedFamily.priority === 'Critical' || selectedFamily.priority === 'High' ? "text-red-600" : "text-gray-700"
                      )}>
                        {selectedFamily.priority}
                      </span>
                      {(selectedFamily.priority === 'Critical' || selectedFamily.priority === 'High') && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Risk Flags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedFamily.flags.length > 0 ? (
                        selectedFamily.flags.map(f => (
                          <span key={f} className="text-xs border border-red-200 text-red-700 bg-red-50 px-2 py-1 rounded font-bold uppercase">
                            {f.replace(/_/g, ' ')}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No flags</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-4">Active Engagement</h3>
                <ul className="space-y-3">
                  {selectedFamily.engagement.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Main Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-heading font-bold text-primary mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Activity Timeline
                </h2>
                
                <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {selectedFamily.history.map((item, i) => (
                    <div key={i} className="relative">
                      <div className={cn(
                        "absolute -left-[39px] w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10",
                        item.type === 'Check-in' ? "bg-primary text-white" :
                        item.type === 'Alert' ? "bg-red-500 text-white" :
                        item.type === 'Service' ? "bg-accent text-primary" :
                        "bg-gray-200 text-gray-600"
                      )}>
                        {item.type === 'Check-in' && <div className="w-2 h-2 bg-white rounded-full" />}
                        {item.type === 'Alert' && <AlertTriangle className="w-4 h-4" />}
                        {item.type === 'Service' && <CheckCircle2 className="w-4 h-4" />}
                        {item.type === 'Event' && <Calendar className="w-4 h-4" />}
                        {item.type === 'System' && <div className="w-2 h-2 bg-gray-500 rounded-full" />}
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex flex-wrap justify-between items-start mb-1 gap-2">
                          <span className={cn(
                            "text-xs font-bold uppercase px-2 py-0.5 rounded",
                            item.type === 'Alert' ? "bg-red-100 text-red-700" : "bg-white border border-gray-200 text-gray-600"
                          )}>
                            {item.type}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary mb-1">Staff Portal</h1>
            <p className="text-gray-500">Manage active cases and support requests.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded text-sm font-medium hover:bg-gray-50 text-gray-600">
               <Download className="w-4 h-4" /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-primary/90 shadow-sm">
               <QrCode className="w-4 h-4" /> Scan Pass
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-primary/90 shadow-sm">
               + New Family
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search families..." className="w-full pl-9 pr-4 py-2 rounded border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
             </div>
             <div className="flex gap-2 w-full md:w-auto">
                <FilterButton active>All Families</FilterButton>
                <FilterButton>High Priority</FilterButton>
                <FilterButton>Housing</FilterButton>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-heading font-bold text-xs uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-5">Families</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Priority</th>
                  <th className="p-5">Risk Flags</th>
                  <th className="p-5">Last Contact</th>
                  <th className="p-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-sans divide-y divide-gray-100">
                {FAMILIES.map((c) => (
                  <tr 
                    key={c.id} 
                    onClick={() => setSelectedFamily(c)}
                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                  >
                    <td className="p-5 font-bold text-primary group-hover:text-accent transition-colors">{c.name}</td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">{c.category}</span>
                    </td>
                    <td className="p-5">
                      <span className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 w-fit",
                        c.priority === 'Critical' || c.priority === 'High' ? "bg-red-100 text-red-700" : 
                        c.priority === 'Medium' ? "bg-orange-100 text-orange-700" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {(c.priority === 'Critical' || c.priority === 'High') && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                        {c.priority}
                      </span>
                    </td>
                    <td className="p-5">
                      {c.flags.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {c.flags.map(f => (
                            <span key={f} className="text-[10px] border border-gray-200 text-gray-600 bg-white px-2 py-0.5 rounded uppercase font-bold">{f.replace(/_/g, ' ')}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No flags</span>
                      )}
                    </td>
                    <td className="p-5 text-sm text-gray-500">{c.lastContact}</td>
                    <td className="p-5 text-right">
                      <button className="text-sm font-bold text-primary group-hover:text-accent transition-colors flex items-center gap-1 justify-end ml-auto">
                        View Profile <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function FilterButton({ children, active }: { children: React.ReactNode, active?: boolean }) {
  return (
    <button className={cn(
      "px-4 py-2 text-sm font-medium rounded transition-all",
      active ? "bg-primary text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
    )}>
      {children}
    </button>
  );
}
