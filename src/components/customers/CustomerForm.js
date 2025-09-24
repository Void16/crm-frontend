import React, { useState } from 'react';
import { AlertTriangle, User, Mail, Phone, X, ChevronDown } from 'lucide-react';
import { countryCodes, defaultCountryCode } from '../../utils/countryCodes'; // Adjust path as needed

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerForm = ({
  show,
  onClose,
  customerForm,
  setCustomerForm,
  onSubmit,
  editingCustomer,
  loading,
  error,
  apiBaseUrl = '/api/customers'
}) => {
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(defaultCountryCode);

  // Initialize phone number with country code when form opens
  React.useEffect(() => {
    if (show && !customerForm.phone) {
      setCustomerForm(prev => ({
        ...prev,
        phone: selectedCountryCode
      }));
    }
  }, [show, customerForm.phone, selectedCountryCode, setCustomerForm]);

  const handleCountryCodeSelect = (country) => {
    setSelectedCountryCode(country.code);
    setShowCountryDropdown(false);
    
    // Update the phone field with the new country code
    const currentPhone = customerForm.phone || '';
    const phoneWithoutCode = currentPhone.replace(/^\+\d+\s?/, '');
    const newPhone = country.code + (phoneWithoutCode ? ` ${phoneWithoutCode}` : '');
    
    setCustomerForm(prev => ({
      ...prev,
      phone: newPhone
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    
    // If the user starts typing without a country code, add the selected one
    if (!value.startsWith('+') && selectedCountryCode) {
      setCustomerForm(prev => ({
        ...prev,
        phone: selectedCountryCode + (value ? ` ${value}` : '')
      }));
    } else {
      setCustomerForm(prev => ({
        ...prev,
        phone: value
      }));
    }
  };

  const getCurrentCountryCode = () => {
    const phone = customerForm.phone || '';
    const match = phone.match(/^(\+\d+)/);
    return match ? match[1] : selectedCountryCode;
  };

  const getPhoneWithoutCountryCode = () => {
    const phone = customerForm.phone || '';
    return phone.replace(/^\+\d+\s?/, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingCustomer) {
      onSubmit();
      return;
    }
    
    await checkForDuplicates();
  };

  const checkForDuplicates = async () => {
    if (!customerForm.email?.trim() && !customerForm.name?.trim()) {
      onSubmit();
      return;
    }

    setCheckingDuplicates(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBaseUrl}/check_duplicate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: customerForm.email?.trim() || '',
          name: customerForm.name?.trim() || ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to check for duplicates');
      }

      const data = await response.json();
      
      if (data.duplicates_found && data.duplicates?.length > 0) {
        setDuplicateInfo(data.duplicates);
        setShowDuplicateModal(true);
      } else {
        onSubmit();
      }
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      onSubmit();
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const proceedWithCreation = () => {
    setShowDuplicateModal(false);
    setDuplicateInfo(null);
    onSubmit();
  };

  const cancelCreation = () => {
    setShowDuplicateModal(false);
    setDuplicateInfo(null);
  };

  const formatDuplicateType = (type) => {
    switch (type) {
      case 'email': return 'Same Email Address';
      case 'company_name': return 'Same Company Name';
      default: return 'Duplicate Found';
    }
  };

  const DuplicateModal = () => (
    <Modal 
      show={showDuplicateModal} 
      onClose={cancelCreation}
      title="⚠️ Duplicate Customer Detected"
    >
      {/* ... keep your existing duplicate modal content ... */}
    </Modal>
  );

  return (
    <>
      <Modal show={show} onClose={onClose} title={editingCustomer ? "Edit Customer" : "Add New Customer"}>
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  {typeof error === 'object' ? (error.message || JSON.stringify(error)) : error}
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerForm.name || ''}
              onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading || checkingDuplicates}
              placeholder="Enter employee name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={customerForm.email || ''}
              onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading || checkingDuplicates}
              placeholder="Enter email address"
            />
          </div>
          
          {/* Updated Phone Number Field with Country Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="flex space-x-2">
              {/* Country Code Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="flex items-center justify-between w-28 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  disabled={loading || checkingDuplicates}
                >
                  <span className="flex items-center space-x-2">
                    <span>{getCurrentCountryCode()}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {showCountryDropdown && (
                  <div className="absolute z-10 w-64 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder="Search countries..."
                        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          // You can add search functionality here
                        }}
                      />
                      {countryCodes.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountryCodeSelect(country)}
                          className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 rounded-md"
                        >
                          <span className="text-lg mr-2">{country.flag}</span>
                          <span className="font-medium mr-2">{country.code}</span>
                          <span className="text-gray-600">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Phone Number Input */}
              <div className="flex-1">
                <input
                  type="tel"
                  value={getPhoneWithoutCountryCode()}
                  onChange={handlePhoneChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading || checkingDuplicates}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Full number: {customerForm.phone || 'Not set'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Council Name</label>
            <input
              type="text"
              value={customerForm.company || ''}
              onChange={(e) => setCustomerForm({...customerForm, company: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading || checkingDuplicates}
              placeholder="Enter council name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title/Department</label>
            <input
              type="text"
              value={customerForm.title || ''}
              onChange={(e) => setCustomerForm({...customerForm, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading || checkingDuplicates}
              placeholder="Enter title or department"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={loading || checkingDuplicates}
              className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {checkingDuplicates ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Checking for duplicates...</span>
                </span>
              ) : loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </span>
              ) : (
                editingCustomer ? 'Update Customer' : 'Add Customer'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading || checkingDuplicates}
              className="flex-1 bg-gray-500 text-white py-2.5 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
          
          {!editingCustomer && (
            <p className="text-xs text-gray-500 text-center">
              * Required fields. Duplicate customers will be automatically detected.
            </p>
          )}
        </div>
      </Modal>
      
      <DuplicateModal />
    </>
  );
};

export default CustomerForm;