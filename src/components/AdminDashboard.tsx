import { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, Clock, X, Loader2, BookOpen, Calculator, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { TextWithVoice } from './TextWithVoice';
import { projectId } from '../utils/supabase/info';

interface StudentData {
  userId: string;
  name: string;
  email: string;
  lastActive: string;
  totalActivities: number;
  literacyCorrect: number;
  literacyTotal: number;
  numeracyCorrect: number;
  numeracyTotal: number;
  totalTimeSpent: number;
  overallAccuracy: number;
}

interface AdminDashboardProps {
  onClose: () => void;
  accessToken: string;
  embedded?: boolean;
}

export function AdminDashboard({ onClose, accessToken, embedded = false }: AdminDashboardProps) {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/admin/students`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch student data');
      }

      const data = await response.json();
      setStudents(data.students || []);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-CA', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate class-wide statistics
  const classStats = {
    totalStudents: students.length,
    avgAccuracy: students.length > 0 
      ? Math.round(students.reduce((sum, s) => sum + s.overallAccuracy, 0) / students.length)
      : 0,
    totalTimeSpent: students.reduce((sum, s) => sum + s.totalTimeSpent, 0),
    totalActivities: students.reduce((sum, s) => sum + s.totalActivities, 0),
  };

  // If embedded mode, render without modal wrapper
  if (embedded) {
    return (
      <>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {/* Class-Wide Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-900">Total Students</span>
                </div>
                <div className="text-3xl text-blue-900">{classStats.totalStudents}</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-900">Avg Accuracy</span>
                </div>
                <div className="text-3xl text-green-900">{classStats.avgAccuracy}%</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-purple-900">Total Time</span>
                </div>
                <div className="text-3xl text-purple-900">{formatTime(classStats.totalTimeSpent)}</div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-orange-900">Activities</span>
                </div>
                <div className="text-3xl text-orange-900">{classStats.totalActivities}</div>
              </div>
            </div>

            {/* Students Table - Desktop View */}
            <div className="hidden lg:block bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg">
                  <TextWithVoice>Student Performance</TextWithVoice>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                          Literacy
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <Calculator className="w-3.5 h-3.5 text-green-600" />
                          Numeracy
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Overall</th>
                      <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Time Spent</th>
                      <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Last Active</th>
                      <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          No student data available yet. Students will appear here once they sign up and play games.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => {
                        const literacyAccuracy = student.literacyTotal > 0 
                          ? Math.round((student.literacyCorrect / student.literacyTotal) * 100)
                          : 0;
                        const numeracyAccuracy = student.numeracyTotal > 0
                          ? Math.round((student.numeracyCorrect / student.numeracyTotal) * 100)
                          : 0;

                        return (
                          <tr key={student.userId} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-semibold text-gray-900">{student.name}</div>
                                <div className="text-xs text-gray-500">{student.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <span className="text-blue-600 font-semibold">
                                  {student.literacyCorrect}/{student.literacyTotal}
                                </span>
                                {student.literacyTotal > 0 && (
                                  <span className="ml-2 text-gray-500">({literacyAccuracy}%)</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <span className="text-green-600 font-semibold">
                                  {student.numeracyCorrect}/{student.numeracyTotal}
                                </span>
                                {student.numeracyTotal > 0 && (
                                  <span className="ml-2 text-gray-500">({numeracyAccuracy}%)</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                                    style={{ width: `${student.overallAccuracy}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold">{Math.round(student.overallAccuracy)}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {formatTime(student.totalTimeSpent)}
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500">
                              {formatDate(student.lastActive)}
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedStudent(student)}
                              >
                                <BarChart3 className="w-4 h-4 mr-1" />
                                Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Students Cards - Mobile/Tablet View */}
            <div className="lg:hidden space-y-4">
              <div className="bg-gray-50 px-4 py-3 rounded-t-xl border-2 border-gray-200 border-b-0">
                <h3 className="text-lg">
                  <TextWithVoice>Student Performance</TextWithVoice>
                </h3>
              </div>
              
              {students.length === 0 ? (
                <div className="bg-white rounded-b-xl border-2 border-gray-200 border-t-0 px-4 py-8 text-center text-gray-500">
                  No student data available yet. Students will appear here once they sign up and play games.
                </div>
              ) : (
                students.map((student) => {
                  const literacyAccuracy = student.literacyTotal > 0 
                    ? Math.round((student.literacyCorrect / student.literacyTotal) * 100)
                    : 0;
                  const numeracyAccuracy = student.numeracyTotal > 0
                    ? Math.round((student.numeracyCorrect / student.numeracyTotal) * 100)
                    : 0;

                  return (
                    <div key={student.userId} className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-sm">
                      {/* Student Header */}
                      <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-200">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg">{student.name}</h4>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                        <div className="ml-2 bg-gradient-to-br from-purple-100 to-blue-100 px-3 py-1 rounded-full">
                          <span className="font-semibold text-purple-700">{Math.round(student.overallAccuracy)}%</span>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {/* Literacy */}
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-blue-900 uppercase">Literacy</span>
                          </div>
                          <div className="font-semibold text-blue-600">
                            {student.literacyCorrect}/{student.literacyTotal}
                          </div>
                          {student.literacyTotal > 0 && (
                            <div className="text-xs text-blue-700">{literacyAccuracy}%</div>
                          )}
                        </div>

                        {/* Numeracy */}
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <Calculator className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-900 uppercase">Numeracy</span>
                          </div>
                          <div className="font-semibold text-green-600">
                            {student.numeracyCorrect}/{student.numeracyTotal}
                          </div>
                          {student.numeracyTotal > 0 && (
                            <div className="text-xs text-green-700">{numeracyAccuracy}%</div>
                          )}
                        </div>

                        {/* Time Spent */}
                        <div className="bg-purple-50 rounded-lg p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span className="text-xs text-purple-900 uppercase">Time</span>
                          </div>
                          <div className="font-semibold text-purple-600">
                            {formatTime(student.totalTimeSpent)}
                          </div>
                        </div>

                        {/* Activities */}
                        <div className="bg-orange-50 rounded-lg p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="w-4 h-4 text-orange-600" />
                            <span className="text-xs text-orange-900 uppercase">Activities</span>
                          </div>
                          <div className="font-semibold text-orange-600">
                            {student.totalActivities}
                          </div>
                        </div>
                      </div>

                      {/* Last Active & Details Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          Last active: {formatDate(student.lastActive)}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setSelectedStudent(null)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full m-4 p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl mb-1">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-900">Literacy</span>
                    </div>
                    <div className="text-2xl text-blue-900 mb-1">
                      {selectedStudent.literacyCorrect}/{selectedStudent.literacyTotal}
                    </div>
                    <div className="text-sm text-blue-700">
                      {selectedStudent.literacyTotal > 0 
                        ? `${Math.round((selectedStudent.literacyCorrect / selectedStudent.literacyTotal) * 100)}% Accuracy`
                        : 'No data yet'}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-900">Numeracy</span>
                    </div>
                    <div className="text-2xl text-green-900 mb-1">
                      {selectedStudent.numeracyCorrect}/{selectedStudent.numeracyTotal}
                    </div>
                    <div className="text-sm text-green-700">
                      {selectedStudent.numeracyTotal > 0
                        ? `${Math.round((selectedStudent.numeracyCorrect / selectedStudent.numeracyTotal) * 100)}% Accuracy`
                        : 'No data yet'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-purple-900">Total Time</span>
                    </div>
                    <div className="text-2xl text-purple-900">
                      {formatTime(selectedStudent.totalTimeSpent)}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <span className="text-sm text-orange-900">Activities</span>
                    </div>
                    <div className="text-2xl text-orange-900">
                      {selectedStudent.totalActivities}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Last Active</div>
                  <div className="text-lg">{formatDate(selectedStudent.lastActive)}</div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setSelectedStudent(null)}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <h2 className="text-2xl">
                <TextWithVoice>Admin Dashboard</TextWithVoice>
              </h2>
              <p className="text-sm opacity-90">Student Performance Overview</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              {/* Class-Wide Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-900">Total Students</span>
                  </div>
                  <div className="text-3xl text-blue-900">{classStats.totalStudents}</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-900">Avg Accuracy</span>
                  </div>
                  <div className="text-3xl text-green-900">{classStats.avgAccuracy}%</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-purple-900">Total Time</span>
                  </div>
                  <div className="text-3xl text-purple-900">{formatTime(classStats.totalTimeSpent)}</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-900">Activities</span>
                  </div>
                  <div className="text-3xl text-orange-900">{classStats.totalActivities}</div>
                </div>
              </div>

              {/* Students Table */}
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h3 className="text-lg">
                    <TextWithVoice>Student Performance</TextWithVoice>
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                            Literacy
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <Calculator className="w-3.5 h-3.5 text-green-600" />
                            Numeracy
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Overall</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Time Spent</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Last Active</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                            No student data available yet. Students will appear here once they sign up and play games.
                          </td>
                        </tr>
                      ) : (
                        students.map((student) => {
                          const literacyAccuracy = student.literacyTotal > 0 
                            ? Math.round((student.literacyCorrect / student.literacyTotal) * 100)
                            : 0;
                          const numeracyAccuracy = student.numeracyTotal > 0
                            ? Math.round((student.numeracyCorrect / student.numeracyTotal) * 100)
                            : 0;

                          return (
                            <tr key={student.userId} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div>
                                  <div className="font-semibold text-gray-900">{student.name}</div>
                                  <div className="text-xs text-gray-500">{student.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm">
                                  <span className="text-blue-600 font-semibold">
                                    {student.literacyCorrect}/{student.literacyTotal}
                                  </span>
                                  {student.literacyTotal > 0 && (
                                    <span className="ml-2 text-gray-500">({literacyAccuracy}%)</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm">
                                  <span className="text-green-600 font-semibold">
                                    {student.numeracyCorrect}/{student.numeracyTotal}
                                  </span>
                                  {student.numeracyTotal > 0 && (
                                    <span className="ml-2 text-gray-500">({numeracyAccuracy}%)</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                                      style={{ width: `${student.overallAccuracy}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-semibold">{Math.round(student.overallAccuracy)}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {formatTime(student.totalTimeSpent)}
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-500">
                                {formatDate(student.lastActive)}
                              </td>
                              <td className="px-6 py-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedStudent(student)}
                                >
                                  <BarChart3 className="w-4 h-4 mr-1" />
                                  Details
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-600">
            Data refreshes automatically when the dashboard is opened
          </p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full m-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl mb-1">{selectedStudent.name}</h3>
                <p className="text-sm text-gray-600">{selectedStudent.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-900">Literacy</span>
                  </div>
                  <div className="text-2xl text-blue-900 mb-1">
                    {selectedStudent.literacyCorrect}/{selectedStudent.literacyTotal}
                  </div>
                  <div className="text-sm text-blue-700">
                    {selectedStudent.literacyTotal > 0 
                      ? `${Math.round((selectedStudent.literacyCorrect / selectedStudent.literacyTotal) * 100)}% Accuracy`
                      : 'No data yet'}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-900">Numeracy</span>
                  </div>
                  <div className="text-2xl text-green-900 mb-1">
                    {selectedStudent.numeracyCorrect}/{selectedStudent.numeracyTotal}
                  </div>
                  <div className="text-sm text-green-700">
                    {selectedStudent.numeracyTotal > 0
                      ? `${Math.round((selectedStudent.numeracyCorrect / selectedStudent.numeracyTotal) * 100)}% Accuracy`
                      : 'No data yet'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-purple-900">Total Time</span>
                  </div>
                  <div className="text-2xl text-purple-900">
                    {formatTime(selectedStudent.totalTimeSpent)}
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-900">Activities</span>
                  </div>
                  <div className="text-2xl text-orange-900">
                    {selectedStudent.totalActivities}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Last Active</div>
                <div className="text-lg">{formatDate(selectedStudent.lastActive)}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedStudent(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}