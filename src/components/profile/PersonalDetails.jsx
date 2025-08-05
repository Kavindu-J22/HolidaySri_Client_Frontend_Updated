import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../config/api';
import ProfileImage from '../common/ProfileImage';
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  X,
  Edit3,
  Upload,
  Loader,
  CheckCircle,
  AlertCircle,
  Crown,
  Briefcase
} from 'lucide-react';

const PersonalDetails = () => {
  const { user, updateUser, refreshUser } = useAuth();

  // Refresh user data when component mounts to ensure latest membership and partner status
  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, [refreshUser]);

  // Debug: Log user data to see if partner fields are present
  useEffect(() => {
    console.log('PersonalDetails - User data:', {
      isPartner: user?.isPartner,
      partnerExpirationDate: user?.partnerExpirationDate,
      isMember: user?.isMember,
      membershipExpirationDate: user?.membershipExpirationDate
    });
  }, [user]);




  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Personal details form data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    contactNumber: user?.contactNumber || '',
    countryCode: user?.countryCode || '+94'
  });



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'daa9e83as');

      // Upload to Cloudinary
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      // Update user profile with new image URL
      const updateResponse = await userAPI.updateProfile({
        profileImage: data.secure_url
      });

      // Handle different possible response structures
      const userData = updateResponse.data?.user || updateResponse.user || updateResponse.data;

      if (userData && userData._id) {
        updateUser(userData);
        setSuccess('Profile image updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        // Fallback: manually update just the profileImage in the context
        updateUser({ profileImage: data.secure_url });
        setSuccess('Profile image updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      // Clear the file input on error too
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await userAPI.updateProfile(formData);
      
      if (response.data.user) {
        updateUser(response.data.user);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      contactNumber: user?.contactNumber || '',
      countryCode: user?.countryCode || '+94'
    });
    setIsEditing(false);
    setError('');
  };



  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Personal Details
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal information and profile settings
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-green-700 dark:text-green-300">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Profile Image Section */}
        <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <ProfileImage
                src={user?.profileImage}
                alt={user?.name}
                size="2xl"
                className="border-4 border-white shadow-lg"
                fallbackIcon={User}
                showSkeleton={true}
              />

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                title="Change profile picture"
              >
                {uploadingImage ? (
                  <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                  {user?.name}
                </h2>
                {user?.isMember && (
                  <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-full border border-yellow-400/30">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-medium">Member</span>
                  </div>
                )}
                {user?.isPartner && (
                  <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full border border-blue-400/30">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span className="text-green-400 text-xs font-medium">Partner</span>
                  </div>
                )}
                {user?.isVerified && (
                  <div className="relative inline-flex items-center justify-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                        fill="#1D9BF0"
                        stroke="#FFFFFF"
                        strokeWidth="1"
                      />
                      <path
                        d="M9 12L11 14L15 10"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-primary-100 mb-2 text-sm sm:text-base truncate">
                {user?.email}
              </p>
              {user?.isMember && user?.membershipExpirationDate && (
                <p className="text-primary-200 mb-2 text-xs sm:text-sm">
                  Member until {new Date(user.membershipExpirationDate).toLocaleDateString()}
                </p>
              )}
              {user?.isPartner && user?.partnerExpirationDate && (
                <p className="text-primary-200 mb-2 text-xs sm:text-sm">
                  Partner until {new Date(user.partnerExpirationDate).toLocaleDateString()}
                </p>
              )}
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-primary-100 text-sm sm:text-base">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{user?.countryCode} {user?.contactNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Account Information
            </h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors w-full sm:w-auto"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{user?.name}</span>
                </div>
              )}
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address (Read-only)
              </label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg min-w-0">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white truncate" title={user?.email}>{user?.email}</span>
              </div>
            </div>

            {/* Country Code Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country Code
              </label>
              {isEditing ? (
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="+94">+94 (Sri Lanka)</option>
                    <option value="+93">+93 (Afghanistan)</option>
                    <option value="+355">+355 (Albania)</option>
                    <option value="+213">+213 (Algeria)</option>
                    <option value="+1-684">+1-684 (American Samoa)</option>
                    <option value="+376">+376 (Andorra)</option>
                    <option value="+244">+244 (Angola)</option>
                    <option value="+1-264">+1-264 (Anguilla)</option>
                    <option value="+672">+672 (Antarctica)</option>
                    <option value="+1-268">+1-268 (Antigua and Barbuda)</option>
                    <option value="+54">+54 (Argentina)</option>
                    <option value="+374">+374 (Armenia)</option>
                    <option value="+297">+297 (Aruba)</option>
                    <option value="+61">+61 (Australia)</option>
                    <option value="+43">+43 (Austria)</option>
                    <option value="+994">+994 (Azerbaijan)</option>
                    <option value="+1-242">+1-242 (Bahamas)</option>
                    <option value="+973">+973 (Bahrain)</option>
                    <option value="+880">+880 (Bangladesh)</option>
                    <option value="+1-246">+1-246 (Barbados)</option>
                    <option value="+375">+375 (Belarus)</option>
                    <option value="+32">+32 (Belgium)</option>
                    <option value="+501">+501 (Belize)</option>
                    <option value="+229">+229 (Benin)</option>
                    <option value="+1-441">+1-441 (Bermuda)</option>
                    <option value="+975">+975 (Bhutan)</option>
                    <option value="+591">+591 (Bolivia)</option>
                    <option value="+387">+387 (Bosnia and Herzegovina)</option>
                    <option value="+267">+267 (Botswana)</option>
                    <option value="+55">+55 (Brazil)</option>
                    <option value="+246">+246 (British Indian Ocean Territory)</option>
                    <option value="+1-284">+1-284 (British Virgin Islands)</option>
                    <option value="+673">+673 (Brunei)</option>
                    <option value="+359">+359 (Bulgaria)</option>
                    <option value="+226">+226 (Burkina Faso)</option>
                    <option value="+257">+257 (Burundi)</option>
                    <option value="+855">+855 (Cambodia)</option>
                    <option value="+237">+237 (Cameroon)</option>
                    <option value="+1">+1 (Canada)</option>
                    <option value="+238">+238 (Cape Verde)</option>
                    <option value="+1-345">+1-345 (Cayman Islands)</option>
                    <option value="+236">+236 (Central African Republic)</option>
                    <option value="+235">+235 (Chad)</option>
                    <option value="+56">+56 (Chile)</option>
                    <option value="+86">+86 (China)</option>
                    <option value="+61">+61 (Christmas Island)</option>
                    <option value="+61">+61 (Cocos Islands)</option>
                    <option value="+57">+57 (Colombia)</option>
                    <option value="+269">+269 (Comoros)</option>
                    <option value="+682">+682 (Cook Islands)</option>
                    <option value="+506">+506 (Costa Rica)</option>
                    <option value="+385">+385 (Croatia)</option>
                    <option value="+53">+53 (Cuba)</option>
                    <option value="+599">+599 (Curaçao)</option>
                    <option value="+357">+357 (Cyprus)</option>
                    <option value="+420">+420 (Czech Republic)</option>
                    <option value="+243">+243 (Democratic Republic of the Congo)</option>
                    <option value="+45">+45 (Denmark)</option>
                    <option value="+253">+253 (Djibouti)</option>
                    <option value="+1-767">+1-767 (Dominica)</option>
                    <option value="+1-809">+1-809 (Dominican Republic)</option>
                    <option value="+1-829">+1-829 (Dominican Republic)</option>
                    <option value="+1-849">+1-849 (Dominican Republic)</option>
                    <option value="+670">+670 (East Timor)</option>
                    <option value="+593">+593 (Ecuador)</option>
                    <option value="+20">+20 (Egypt)</option>
                    <option value="+503">+503 (El Salvador)</option>
                    <option value="+240">+240 (Equatorial Guinea)</option>
                    <option value="+291">+291 (Eritrea)</option>
                    <option value="+372">+372 (Estonia)</option>
                    <option value="+251">+251 (Ethiopia)</option>
                    <option value="+500">+500 (Falkland Islands)</option>
                    <option value="+298">+298 (Faroe Islands)</option>
                    <option value="+679">+679 (Fiji)</option>
                    <option value="+358">+358 (Finland)</option>
                    <option value="+33">+33 (France)</option>
                    <option value="+689">+689 (French Polynesia)</option>
                    <option value="+241">+241 (Gabon)</option>
                    <option value="+220">+220 (Gambia)</option>
                    <option value="+995">+995 (Georgia)</option>
                    <option value="+49">+49 (Germany)</option>
                    <option value="+233">+233 (Ghana)</option>
                    <option value="+350">+350 (Gibraltar)</option>
                    <option value="+30">+30 (Greece)</option>
                    <option value="+299">+299 (Greenland)</option>
                    <option value="+1-473">+1-473 (Grenada)</option>
                    <option value="+1-671">+1-671 (Guam)</option>
                    <option value="+502">+502 (Guatemala)</option>
                    <option value="+44-1481">+44-1481 (Guernsey)</option>
                    <option value="+224">+224 (Guinea)</option>
                    <option value="+245">+245 (Guinea-Bissau)</option>
                    <option value="+592">+592 (Guyana)</option>
                    <option value="+509">+509 (Haiti)</option>
                    <option value="+504">+504 (Honduras)</option>
                    <option value="+852">+852 (Hong Kong)</option>
                    <option value="+36">+36 (Hungary)</option>
                    <option value="+354">+354 (Iceland)</option>
                    <option value="+91">+91 (India)</option>
                    <option value="+62">+62 (Indonesia)</option>
                    <option value="+98">+98 (Iran)</option>
                    <option value="+964">+964 (Iraq)</option>
                    <option value="+353">+353 (Ireland)</option>
                    <option value="+44-1624">+44-1624 (Isle of Man)</option>
                    <option value="+972">+972 (Israel)</option>
                    <option value="+39">+39 (Italy)</option>
                    <option value="+225">+225 (Ivory Coast)</option>
                    <option value="+1-876">+1-876 (Jamaica)</option>
                    <option value="+81">+81 (Japan)</option>
                    <option value="+44-1534">+44-1534 (Jersey)</option>
                    <option value="+962">+962 (Jordan)</option>
                    <option value="+7">+7 (Kazakhstan)</option>
                    <option value="+254">+254 (Kenya)</option>
                    <option value="+686">+686 (Kiribati)</option>
                    <option value="+383">+383 (Kosovo)</option>
                    <option value="+965">+965 (Kuwait)</option>
                    <option value="+996">+996 (Kyrgyzstan)</option>
                    <option value="+856">+856 (Laos)</option>
                    <option value="+371">+371 (Latvia)</option>
                    <option value="+961">+961 (Lebanon)</option>
                    <option value="+266">+266 (Lesotho)</option>
                    <option value="+231">+231 (Liberia)</option>
                    <option value="+218">+218 (Libya)</option>
                    <option value="+423">+423 (Liechtenstein)</option>
                    <option value="+370">+370 (Lithuania)</option>
                    <option value="+352">+352 (Luxembourg)</option>
                    <option value="+853">+853 (Macau)</option>
                    <option value="+389">+389 (Macedonia)</option>
                    <option value="+261">+261 (Madagascar)</option>
                    <option value="+265">+265 (Malawi)</option>
                    <option value="+60">+60 (Malaysia)</option>
                    <option value="+960">+960 (Maldives)</option>
                    <option value="+223">+223 (Mali)</option>
                    <option value="+356">+356 (Malta)</option>
                    <option value="+692">+692 (Marshall Islands)</option>
                    <option value="+222">+222 (Mauritania)</option>
                    <option value="+230">+230 (Mauritius)</option>
                    <option value="+262">+262 (Mayotte)</option>
                    <option value="+52">+52 (Mexico)</option>
                    <option value="+691">+691 (Micronesia)</option>
                    <option value="+373">+373 (Moldova)</option>
                    <option value="+377">+377 (Monaco)</option>
                    <option value="+976">+976 (Mongolia)</option>
                    <option value="+382">+382 (Montenegro)</option>
                    <option value="+1-664">+1-664 (Montserrat)</option>
                    <option value="+212">+212 (Morocco)</option>
                    <option value="+258">+258 (Mozambique)</option>
                    <option value="+95">+95 (Myanmar)</option>
                    <option value="+264">+264 (Namibia)</option>
                    <option value="+674">+674 (Nauru)</option>
                    <option value="+977">+977 (Nepal)</option>
                    <option value="+31">+31 (Netherlands)</option>
                    <option value="+599">+599 (Netherlands Antilles)</option>
                    <option value="+687">+687 (New Caledonia)</option>
                    <option value="+64">+64 (New Zealand)</option>
                    <option value="+505">+505 (Nicaragua)</option>
                    <option value="+227">+227 (Niger)</option>
                    <option value="+234">+234 (Nigeria)</option>
                    <option value="+683">+683 (Niue)</option>
                    <option value="+850">+850 (North Korea)</option>
                    <option value="+1-670">+1-670 (Northern Mariana Islands)</option>
                    <option value="+47">+47 (Norway)</option>
                    <option value="+968">+968 (Oman)</option>
                    <option value="+92">+92 (Pakistan)</option>
                    <option value="+680">+680 (Palau)</option>
                    <option value="+970">+970 (Palestine)</option>
                    <option value="+507">+507 (Panama)</option>
                    <option value="+675">+675 (Papua New Guinea)</option>
                    <option value="+595">+595 (Paraguay)</option>
                    <option value="+51">+51 (Peru)</option>
                    <option value="+63">+63 (Philippines)</option>
                    <option value="+64">+64 (Pitcairn)</option>
                    <option value="+48">+48 (Poland)</option>
                    <option value="+351">+351 (Portugal)</option>
                    <option value="+1-787">+1-787 (Puerto Rico)</option>
                    <option value="+1-939">+1-939 (Puerto Rico)</option>
                    <option value="+974">+974 (Qatar)</option>
                    <option value="+242">+242 (Republic of the Congo)</option>
                    <option value="+262">+262 (Réunion)</option>
                    <option value="+40">+40 (Romania)</option>
                    <option value="+7">+7 (Russia)</option>
                    <option value="+250">+250 (Rwanda)</option>
                    <option value="+590">+590 (Saint Barthélemy)</option>
                    <option value="+290">+290 (Saint Helena)</option>
                    <option value="+1-869">+1-869 (Saint Kitts and Nevis)</option>
                    <option value="+1-758">+1-758 (Saint Lucia)</option>
                    <option value="+590">+590 (Saint Martin)</option>
                    <option value="+508">+508 (Saint Pierre and Miquelon)</option>
                    <option value="+1-784">+1-784 (Saint Vincent and the Grenadines)</option>
                    <option value="+685">+685 (Samoa)</option>
                    <option value="+378">+378 (San Marino)</option>
                    <option value="+239">+239 (Sao Tome and Principe)</option>
                    <option value="+966">+966 (Saudi Arabia)</option>
                    <option value="+221">+221 (Senegal)</option>
                    <option value="+381">+381 (Serbia)</option>
                    <option value="+248">+248 (Seychelles)</option>
                    <option value="+232">+232 (Sierra Leone)</option>
                    <option value="+65">+65 (Singapore)</option>
                    <option value="+1-721">+1-721 (Sint Maarten)</option>
                    <option value="+421">+421 (Slovakia)</option>
                    <option value="+386">+386 (Slovenia)</option>
                    <option value="+677">+677 (Solomon Islands)</option>
                    <option value="+252">+252 (Somalia)</option>
                    <option value="+27">+27 (South Africa)</option>
                    <option value="+82">+82 (South Korea)</option>
                    <option value="+211">+211 (South Sudan)</option>
                    <option value="+34">+34 (Spain)</option>
                    <option value="+249">+249 (Sudan)</option>
                    <option value="+597">+597 (Suriname)</option>
                    <option value="+47">+47 (Svalbard and Jan Mayen)</option>
                    <option value="+268">+268 (Swaziland)</option>
                    <option value="+46">+46 (Sweden)</option>
                    <option value="+41">+41 (Switzerland)</option>
                    <option value="+963">+963 (Syria)</option>
                    <option value="+886">+886 (Taiwan)</option>
                    <option value="+992">+992 (Tajikistan)</option>
                    <option value="+255">+255 (Tanzania)</option>
                    <option value="+66">+66 (Thailand)</option>
                    <option value="+228">+228 (Togo)</option>
                    <option value="+690">+690 (Tokelau)</option>
                    <option value="+676">+676 (Tonga)</option>
                    <option value="+1-868">+1-868 (Trinidad and Tobago)</option>
                    <option value="+216">+216 (Tunisia)</option>
                    <option value="+90">+90 (Turkey)</option>
                    <option value="+993">+993 (Turkmenistan)</option>
                    <option value="+1-649">+1-649 (Turks and Caicos Islands)</option>
                    <option value="+688">+688 (Tuvalu)</option>
                    <option value="+1-340">+1-340 (U.S. Virgin Islands)</option>
                    <option value="+256">+256 (Uganda)</option>
                    <option value="+380">+380 (Ukraine)</option>
                    <option value="+971">+971 (United Arab Emirates)</option>
                    <option value="+44">+44 (United Kingdom)</option>
                    <option value="+1">+1 (United States)</option>
                    <option value="+598">+598 (Uruguay)</option>
                    <option value="+998">+998 (Uzbekistan)</option>
                    <option value="+678">+678 (Vanuatu)</option>
                    <option value="+379">+379 (Vatican)</option>
                    <option value="+58">+58 (Venezuela)</option>
                    <option value="+84">+84 (Vietnam)</option>
                    <option value="+681">+681 (Wallis and Futuna)</option>
                    <option value="+212">+212 (Western Sahara)</option>
                    <option value="+967">+967 (Yemen)</option>
                    <option value="+260">+260 (Zambia)</option>
                    <option value="+263">+263 (Zimbabwe)</option>
                </select>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{user?.countryCode}</span>
                </div>
              )}
            </div>

            {/* Contact Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your contact number"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{user?.contactNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
              Profile Image Guidelines
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Supported formats: JPG, PNG, GIF</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Recommended dimensions: 400x400 pixels</li>
              <li>• Images are automatically optimized and resized</li>
            </ul>
          </div>
        </div>
      </div>


    </div>
  );
};

export default PersonalDetails;
