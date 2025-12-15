import { useState, useMemo } from "react";
import { useScore } from "../contexts/ScoreContext";
import { Button } from "./ui/button";
import { Download, Send, X, Clock, Calendar, TrendingUp, Award, CheckCircle2, Circle, BarChart3, LineChart as LineChartIcon } from "lucide-react";
import { TextWithVoice } from "./TextWithVoice";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

interface ReportCardProps {
  onClose: () => void;
}

type TimeRange = 'today' | 'week' | 'month' | 'year';

interface CurriculumTask {
  id: string;
  category: "literacy" | "numeracy";
  description: string;
  requiredAccuracy: number;
  gameIds: string[];
}

const curriculumTasks: CurriculumTask[] = [
  // Literacy Tasks
  {
    id: "reading-comprehension",
    category: "literacy",
    description: "demonstrate understanding of reading passages and answer comprehension questions.",
    requiredAccuracy: 70,
    gameIds: ["reading"]
  },
  {
    id: "sentence-building",
    category: "literacy",
    description: "construct grammatically correct sentences with proper word order.",
    requiredAccuracy: 70,
    gameIds: ["sentence"]
  },
  {
    id: "spelling-accuracy",
    category: "literacy",
    description: "spell level-appropriate words correctly.",
    requiredAccuracy: 70,
    gameIds: ["spelling"]
  },
  {
    id: "phonics-awareness",
    category: "literacy",
    description: "identify and match phonetic sounds in words.",
    requiredAccuracy: 70,
    gameIds: ["phonics"]
  },
  {
    id: "story-sequencing",
    category: "literacy",
    description: "arrange story events in logical chronological order.",
    requiredAccuracy: 70,
    gameIds: ["story"]
  },
  {
    id: "rhyming-patterns",
    category: "literacy",
    description: "recognize and create rhyming word patterns.",
    requiredAccuracy: 70,
    gameIds: ["rhyming"]
  },
  {
    id: "word-structure",
    category: "literacy",
    description: "identify and use prefixes and suffixes to modify word meanings.",
    requiredAccuracy: 70,
    gameIds: ["prefixsuffix"]
  },
  {
    id: "typing-fluency",
    category: "literacy",
    description: "type with accuracy and developing speed.",
    requiredAccuracy: 70,
    gameIds: ["typing"]
  },
  {
    id: "geography-knowledge",
    category: "literacy",
    description: "demonstrate knowledge of Canadian geography and landmarks.",
    requiredAccuracy: 70,
    gameIds: ["geography"]
  },
  // Numeracy Tasks
  {
    id: "basic-operations",
    category: "numeracy",
    description: "solve addition, subtraction, multiplication, and division problems accurately.",
    requiredAccuracy: 70,
    gameIds: ["math"]
  },
  {
    id: "multiplication-facts",
    category: "numeracy",
    description: "recall multiplication facts (times tables) quickly and accurately.",
    requiredAccuracy: 70,
    gameIds: ["timestables"]
  },
  {
    id: "pattern-recognition",
    category: "numeracy",
    description: "identify, extend, and create number and shape patterns.",
    requiredAccuracy: 70,
    gameIds: ["pattern"]
  },
  {
    id: "shape-comparison",
    category: "numeracy",
    description: "compare, count, and analyze geometric shapes and their properties.",
    requiredAccuracy: 70,
    gameIds: ["shapecomparison"]
  },
];

export function ReportCard({ onClose }: ReportCardProps) {
  const { literacyScore, numeracyScore, activityLog, timeSpent } = useScore();
  const [sending, setSending] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('today');

  // Get user initials
  const getInitials = () => {
    return "ST";
  };

  // Get display name
  const getDisplayName = () => {
    return "Student";
  };

  // Filter activities by time range
  const filteredActivities = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return activityLog.filter(activity => {
      const activityDate = new Date(activity.date);
      switch (timeRange) {
        case 'today':
          return activityDate >= startOfDay;
        case 'week':
          return activityDate >= startOfWeek;
        case 'month':
          return activityDate >= startOfMonth;
        case 'year':
          return activityDate >= startOfYear;
        default:
          return true;
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activityLog, timeRange]);

  // Calculate time stats
  const timeStats = useMemo(() => {
    const stats = {
      today: 0,
      week: 0,
      month: 0,
      year: 0,
    };

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    activityLog.forEach(activity => {
      const activityDate = new Date(activity.date);
      if (activityDate >= startOfDay) stats.today += activity.duration;
      if (activityDate >= startOfWeek) stats.week += activity.duration;
      if (activityDate >= startOfMonth) stats.month += activity.duration;
      if (activityDate >= startOfYear) stats.year += activity.duration;
    });

    return stats;
  }, [activityLog]);

  // Format duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  // Calculate proficiency for each task
  const getTaskProficiency = (task: CurriculumTask): boolean => {
    const score = task.category === "literacy" ? literacyScore : numeracyScore;
    const accuracy = score.total > 0 ? (score.correct / score.total) * 100 : 0;
    return accuracy >= task.requiredAccuracy;
  };

  // Get tasks that need help
  const tasksNeedingHelp = curriculumTasks.filter(task => !getTaskProficiency(task));
  const proficientTasks = curriculumTasks.filter(task => getTaskProficiency(task));

  // Calculate overall stats
  const totalLiteracyTasks = curriculumTasks.filter(t => t.category === "literacy").length;
  const totalNumeracyTasks = curriculumTasks.filter(t => t.category === "numeracy").length;
  const proficientLiteracyTasks = proficientTasks.filter(t => t.category === "literacy").length;
  const proficientNumeracyTasks = proficientTasks.filter(t => t.category === "numeracy").length;

  const literacyAccuracy = literacyScore.total > 0 
    ? Math.round((literacyScore.correct / literacyScore.total) * 100) 
    : 0;
  const numeracyAccuracy = numeracyScore.total > 0 
    ? Math.round((numeracyScore.correct / numeracyScore.total) * 100) 
    : 0;

  // Calculate standards covered percentage
  const totalStandards = curriculumTasks.length;
  const coveredStandards = proficientTasks.length;
  const standardsPercentage = Math.round((coveredStandards / totalStandards) * 100);

  // Prepare chart data for progress over time
  const progressChartData = useMemo(() => {
    // Group activities by date
    const dailyData: { [key: string]: { literacy: number[], numeracy: number[], count: number } } = {};
    
    filteredActivities.forEach(activity => {
      const dateKey = new Date(activity.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { literacy: [], numeracy: [], count: 0 };
      }
      if (activity.type === 'literacy') {
        dailyData[dateKey].literacy.push(activity.accuracy);
      } else {
        dailyData[dateKey].numeracy.push(activity.accuracy);
      }
      dailyData[dateKey].count++;
    });

    // Calculate averages
    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      literacy: data.literacy.length > 0 
        ? Math.round(data.literacy.reduce((a, b) => a + b, 0) / data.literacy.length) 
        : 0,
      numeracy: data.numeracy.length > 0 
        ? Math.round(data.numeracy.reduce((a, b) => a + b, 0) / data.numeracy.length) 
        : 0,
      activities: data.count,
    })).reverse().slice(-14); // Last 14 days
  }, [filteredActivities]);

  // Prepare activity distribution data
  const activityDistributionData = useMemo(() => {
    const literacyCount = filteredActivities.filter(a => a.type === 'literacy').length;
    const numeracyCount = filteredActivities.filter(a => a.type === 'numeracy').length;
    
    return [
      { category: 'Literacy', activities: literacyCount, proficient: proficientLiteracyTasks, total: totalLiteracyTasks },
      { category: 'Numeracy', activities: numeracyCount, proficient: proficientNumeracyTasks, total: totalNumeracyTasks },
    ];
  }, [filteredActivities, proficientLiteracyTasks, proficientNumeracyTasks, totalLiteracyTasks, totalNumeracyTasks]);

  // Prepare usage trend data (activities per day)
  const usageTrendData = useMemo(() => {
    const dailyCounts: { [key: string]: number } = {};
    
    // Get last 7 days
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
      dailyCounts[dateKey] = 0;
    }

    // Count activities per day
    filteredActivities.forEach(activity => {
      const dateKey = new Date(activity.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
      if (dateKey in dailyCounts) {
        dailyCounts[dateKey]++;
      }
    });

    return Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      activities: count,
    }));
  }, [filteredActivities]);

  // Prepare skills gained data
  const skillsGainedData = useMemo(() => {
    return [
      {
        category: 'Not Meeting Target',
        skills: tasksNeedingHelp.length,
      },
      {
        category: 'Meeting Target',
        skills: proficientTasks.length,
      },
    ];
  }, [tasksNeedingHelp, proficientTasks]);

  const handleDownload = () => {
    const reportText = `
CAN|EDU GAMES PROGRESS REPORT
============================

Student: ${getDisplayName()}
Date: ${new Date().toLocaleDateString()}
Level: Canadian Curriculum

TIME TRACKING
-------------
Today: ${formatDuration(timeStats.today)}
This Week: ${formatDuration(timeStats.week)}
This Month: ${formatDuration(timeStats.month)}
This Year: ${formatDuration(timeStats.year)}

OVERALL PERFORMANCE
-------------------
Literacy Activities: ${proficientLiteracyTasks}/${totalLiteracyTasks} tasks proficient (${literacyAccuracy}% accuracy)
Numeracy Activities: ${proficientNumeracyTasks}/${totalNumeracyTasks} tasks proficient (${numeracyAccuracy}% accuracy)
Standards Covered: ${standardsPercentage}%

RECENT ACTIVITIES
-----------------
${filteredActivities.map(activity => 
  `${new Date(activity.date).toLocaleDateString()} - ${activity.gameName}: ${Math.round(activity.accuracy)}% (${activity.correct}/${activity.total}) - ${formatDuration(activity.duration)}`
).join('\n')}

PROFICIENT IN
-------------
${proficientTasks.map(task => `✓ ${task.description}`).join('\n')}

NEEDS HELP TO
-------------
${tasksNeedingHelp.map(task => `○ ${task.description}`).join('\n')}

---
Generated by CAN|EDU Games - Canadian Curriculum Learning
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getDisplayName()}_Progress_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendToParents = async () => {
    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("Report card functionality coming soon! Download the report and share it with parents.");
    setSending(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-start justify-between rounded-t-lg">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">{getInitials()}</span>
              </div>
              <div>
                <h2 className="text-2xl">
                  <TextWithVoice>{getDisplayName()}'s Progress Report</TextWithVoice>
                </h2>
                <p className="text-sm text-gray-600">
                  <TextWithVoice>Canadian Curriculum Learning | {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</TextWithVoice>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              onClick={handleSendToParents}
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700"
              disabled={sending}
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Send to Parents"}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="ml-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Time Tracking Section */}
          <div className="px-6 py-6 bg-gradient-to-br from-blue-50 to-purple-50 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl">
                <TextWithVoice>Time on Site</TextWithVoice>
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-3xl text-blue-600 mb-1">{formatDuration(timeStats.today)}</div>
                <div className="text-sm text-gray-600">Today</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-3xl text-purple-600 mb-1">{formatDuration(timeStats.week)}</div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-3xl text-green-600 mb-1">{formatDuration(timeStats.month)}</div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-3xl text-amber-600 mb-1">{formatDuration(timeStats.year)}</div>
                <div className="text-sm text-gray-600">This Year</div>
              </div>
            </div>
          </div>

          {/* Overall Performance Summary */}
          <div className="px-6 py-6 bg-gray-50 border-b">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-xl">
                <TextWithVoice>Overall Performance</TextWithVoice>
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Literacy Activities</span>
                  <span className="text-2xl text-blue-600">{literacyAccuracy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${literacyAccuracy}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  {proficientLiteracyTasks}/{totalLiteracyTasks} curriculum tasks proficient
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Numeracy Activities</span>
                  <span className="text-2xl text-green-600">{numeracyAccuracy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${numeracyAccuracy}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  {proficientNumeracyTasks}/{totalNumeracyTasks} curriculum tasks proficient
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Standards Covered</span>
                  <span className="text-2xl text-purple-600">{standardsPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${standardsPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  {coveredStandards}/{totalStandards} standards achieved
                </p>
              </div>
            </div>
          </div>

          {/* Analytics & Growth Charts */}
          {activityLog.length > 0 && (
            <div className="px-6 py-6 bg-white border-b">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl">
                  <TextWithVoice>Learning Analytics & Growth</TextWithVoice>
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Usage Chart */}
                <div className="bg-white border rounded-lg p-4">
                  <div className="mb-3">
                    <h4 className="text-sm mb-1">
                      <TextWithVoice>Usage</TextWithVoice>
                    </h4>
                    <p className="text-xs text-gray-500">
                      <TextWithVoice>Activities completed per day. Updated daily.</TextWithVoice>
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={usageTrendData}>
                      <defs>
                        <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        stroke="#999"
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        stroke="#999"
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="activities" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fill="url(#colorActivities)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Progress Chart */}
                {progressChartData.length > 0 && (
                  <div className="bg-white border rounded-lg p-4">
                    <div className="mb-3">
                      <h4 className="text-sm mb-1">
                        <TextWithVoice>Progress</TextWithVoice>
                      </h4>
                      <p className="text-xs text-gray-500">
                        <TextWithVoice>Accuracy trends for literacy & numeracy. Updated daily.</TextWithVoice>
                      </p>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={progressChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 10 }}
                          stroke="#999"
                        />
                        <YAxis 
                          domain={[0, 100]}
                          tick={{ fontSize: 10 }}
                          stroke="#999"
                        />
                        <Tooltip 
                          contentStyle={{ fontSize: 12, borderRadius: 8 }}
                          formatter={(value: number) => `${value}%`}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: 11 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="literacy" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Literacy"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="numeracy" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Numeracy"
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Skills Gained Chart */}
                <div className="bg-white border rounded-lg p-4">
                  <div className="mb-3">
                    <h4 className="text-sm mb-1">
                      <TextWithVoice>Standards Progress</TextWithVoice>
                    </h4>
                    <p className="text-xs text-gray-500">
                      <TextWithVoice>Number of curriculum standards achieved.</TextWithVoice>
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={skillsGainedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="category" 
                        tick={{ fontSize: 10 }}
                        stroke="#999"
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        stroke="#999"
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      />
                      <Bar 
                        dataKey="skills" 
                        fill="#8b5cf6"
                        radius={[8, 8, 0, 0]}
                        name="Standards"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3 text-center text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-3 h-3 bg-green-500 rounded"></span>
                      Meeting Target: {proficientTasks.length} standards
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activities Completed Section */}
          <div className="px-6 py-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl">
                  <TextWithVoice>Activities Completed</TextWithVoice>
                </h3>
              </div>
              <div className="flex gap-2">
                {(['today', 'week', 'month', 'year'] as TimeRange[]).map((range) => (
                  <Button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    className="capitalize"
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>

            {filteredActivities.length > 0 ? (
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">Activity Name</th>
                      <th className="px-4 py-3 text-center text-xs text-gray-600 uppercase">Performance</th>
                      <th className="px-4 py-3 text-center text-xs text-gray-600 uppercase">Accuracy</th>
                      <th className="px-4 py-3 text-center text-xs text-gray-600 uppercase">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map((activity, index) => {
                      const accuracy = Math.round(activity.accuracy);
                      const isProficient = accuracy >= 70;
                      return (
                        <tr key={activity.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {new Date(activity.date).toLocaleDateString('en-CA', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              {activity.type === 'literacy' ? (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              ) : (
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                              )}
                              <span className="text-gray-700">{activity.gameName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all ${
                                    isProficient ? 'bg-green-500' : 'bg-red-400'
                                  }`}
                                  style={{ width: `${accuracy}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                              isProficient 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {accuracy}% ({activity.correct}/{activity.total})
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {formatDuration(activity.duration)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 border rounded-lg p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  <TextWithVoice>No activities recorded for this time period.</TextWithVoice>
                </p>
              </div>
            )}
          </div>

          {/* Proficient Tasks */}
          {proficientTasks.length > 0 && (
            <div className="px-6 py-6 border-b bg-green-50">
              <h3 className="text-xl mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <TextWithVoice>{getDisplayName()} shows proficiency to</TextWithVoice>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {proficientTasks.map(task => (
                  <div key={task.id} className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <TextWithVoice>{task.description}</TextWithVoice>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Needing Help */}
          {tasksNeedingHelp.length > 0 && (
            <div className="px-6 py-6 bg-amber-50">
              <h3 className="text-xl mb-4 flex items-center gap-2">
                <Circle className="w-6 h-6 text-amber-600" />
                <TextWithVoice>{getDisplayName()} needs help to</TextWithVoice>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {tasksNeedingHelp.map(task => (
                  <div key={task.id} className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                    <Circle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <TextWithVoice>{task.description}</TextWithVoice>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Activity Yet */}
          {proficientTasks.length === 0 && tasksNeedingHelp.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">
                <TextWithVoice>No activity recorded yet.</TextWithVoice>
              </p>
              <p className="text-sm text-gray-400">
                <TextWithVoice>Start playing games to see your progress!</TextWithVoice>
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 bg-gray-50 border-t text-center text-sm text-gray-600 rounded-b-lg">
          <p className="mb-1">
            <TextWithVoice>Proficiency is demonstrated by achieving 70% or higher accuracy in related activities.</TextWithVoice>
          </p>
          <p className="text-xs text-gray-500">
            <TextWithVoice>Report generated by CAN|EDU Games - Canadian Curriculum Learning Platform</TextWithVoice>
          </p>
        </div>
      </div>
    </div>
  );
}