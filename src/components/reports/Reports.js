import React, { useState } from 'react';
import { Calendar, Download, BarChart3, Users, FileText, ChevronDown } from 'lucide-react';

// Mock adminAPI for demonstration
const adminAPI = {
  getCustomerReport: async (params) => ({
    ok: true,
    data: {
      period: { start_date: '2024-01-01', end_date: '2024-12-31' },
      total_customers: 150,
      customer_stats: [
        { assigned_employee__first_name: 'John', assigned_employee__last_name: 'Doe', count: 25 },
        { assigned_employee__first_name: 'Jane', assigned_employee__last_name: 'Smith', count: 30 },
        { assigned_employee__first_name: 'Mike', assigned_employee__last_name: 'Johnson', count: 20 }
      ],
      customers: [
        {
          id: 1,
          name: 'Acme Corp',
          email: 'contact@acme.com',
          company: 'Acme Corporation',
          assigned_employee__first_name: 'John',
          assigned_employee__last_name: 'Doe',
          created_at: '2024-03-15T10:00:00Z'
        },
        {
          id: 2,
          name: 'Tech Solutions',
          email: 'info@techsol.com',
          company: 'Tech Solutions Inc',
          assigned_employee__first_name: 'Jane',
          assigned_employee__last_name: 'Smith',
          created_at: '2024-06-20T14:30:00Z'
        }
      ]
    }
  }),
  getEmployeeActivityReport: async () => ({
    ok: true,
    data: {
      inactive_employees: [
        { id: 1, first_name: 'Bob', last_name: 'Wilson', last_activity: '2024-08-15T09:00:00Z' }
      ],
      recent_activities: [
        { employee__username: 'johndoe', action: 'Created customer', timestamp: '2024-09-20T16:45:00Z' },
        { employee__username: 'janesmith', action: 'Updated profile', timestamp: '2024-09-21T11:30:00Z' }
      ]
    }
  })
};

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [employeeReportData, setEmployeeReportData] = useState(null);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    customerStats: true,
    customerDetails: false,
    inactiveEmployees: true,
    recentActivities: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const generateCustomerReport = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (dateRange.start_date) params.append('start_date', dateRange.start_date);
    if (dateRange.end_date) params.append('end_date', dateRange.end_date);
    
    const result = await adminAPI.getCustomerReport(params);
    if (result?.ok) {
      setReportData(result.data);
    }
    setLoading(false);
  };

  const generateEmployeeReport = async () => {
    setLoading(true);
    const result = await adminAPI.getEmployeeActivityReport();
    if (result?.ok) {
      setEmployeeReportData(result.data);
    }
    setLoading(false);
  };

  const downloadPDFReport = async () => {
    const params = new URLSearchParams();
    if (dateRange.start_date) params.append('start_date', dateRange.start_date);
    if (dateRange.end_date) params.append('end_date', dateRange.end_date);
    
    try {
      // Mock PDF download for demo
      console.log('Downloading PDF report...');
      alert('PDF download would start here');
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const MobileCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-3 text-sm">{title}</h4>
        {children}
      </div>
    </div>
  );

  const CollapsibleSection = ({ title, icon: Icon, sectionKey, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2 text-gray-600" />
          <h4 className="font-medium text-gray-900">{title}</h4>
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${
            expandedSections[sectionKey] ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-4">
      {/* Date Range Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Select Date Range
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange({...dateRange, start_date: e.target.value})}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({...dateRange, end_date: e.target.value})}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
          </div>
          <button
            onClick={generateCustomerReport}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center font-medium"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Report Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={downloadPDFReport}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center font-medium"
        >
          <Download className="h-5 w-5 mr-2" />
          Download PDF
        </button>
        
        <button
          onClick={generateEmployeeReport}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center font-medium"
        >
          <Users className="h-5 w-5 mr-2" />
          Employee Report
        </button>
      </div>

      {/* Customer Report Results */}
      {reportData && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Customer Report
            </h3>
            <div className="text-sm text-gray-600 mb-4">
              {reportData.period.start_date} to {reportData.period.end_date}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-800">{reportData.total_customers}</div>
              <div className="text-sm text-blue-600 font-medium">Total Customers</div>
            </div>
          </div>

          {/* Customers by Employee - Mobile Cards */}
          <CollapsibleSection 
            title="Customers by Employee" 
            icon={Users}
            sectionKey="customerStats"
          >
            <div className="space-y-3 mt-3">
              {reportData.customer_stats.map((stat, index) => (
                <MobileCard key={index} title={`${stat.assigned_employee__first_name} ${stat.assigned_employee__last_name}`}>
                  <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
                  <div className="text-sm text-gray-600">customers assigned</div>
                </MobileCard>
              ))}
            </div>
          </CollapsibleSection>

          {/* Customer Details - Mobile Cards */}
          <CollapsibleSection 
            title="Customer Details" 
            icon={FileText}
            sectionKey="customerDetails"
          >
            <div className="space-y-3 mt-3">
              {reportData.customers.map((customer) => (
                <MobileCard key={customer.id} title={customer.name} className="border-l-4 border-l-blue-500">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <div className="text-gray-900 break-all">{customer.email}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Company:</span>
                      <div className="text-gray-900">{customer.company}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Assigned To:</span>
                      <div className="text-gray-900">
                        {customer.assigned_employee__first_name} {customer.assigned_employee__last_name}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Created:</span>
                      <div className="text-gray-900">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </MobileCard>
              ))}
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Employee Activity Report Results */}
      {employeeReportData && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Employee Activity Report
            </h3>
          </div>
          
          {/* Inactive Employees */}
          <CollapsibleSection 
            title="Inactive Employees" 
            icon={Users}
            sectionKey="inactiveEmployees"
          >
            <div className="mt-3">
              {employeeReportData.inactive_employees.length > 0 ? (
                <div className="space-y-3">
                  {employeeReportData.inactive_employees.map((employee) => (
                    <MobileCard 
                      key={employee.id} 
                      title={`${employee.first_name} ${employee.last_name}`}
                      className="border-l-4 border-l-orange-500"
                    >
                      <div className="text-sm">
                        <span className="font-medium text-gray-600">Last Activity:</span>
                        <div className="text-gray-900">
                          {new Date(employee.last_activity).toLocaleDateString()}
                        </div>
                      </div>
                    </MobileCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No inactive employees</p>
                </div>
              )}
            </div>
          </CollapsibleSection>
          
          {/* Recent Activities */}
          <CollapsibleSection 
            title="Recent Activities" 
            icon={BarChart3}
            sectionKey="recentActivities"
          >
            <div className="mt-3">
              {employeeReportData.recent_activities.length > 0 ? (
                <div className="space-y-3">
                  {employeeReportData.recent_activities.map((activity, index) => (
                    <MobileCard 
                      key={index} 
                      title={activity.employee__username}
                      className="border-l-4 border-l-green-500"
                    >
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium text-gray-600">Action:</span>
                          <div className="text-gray-900">{activity.action}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Time:</span>
                          <div className="text-gray-900">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </MobileCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No recent activities</p>
                </div>
              )}
            </div>
          </CollapsibleSection>
        </div>
      )}
    </div>
  );
};

export default Reports;