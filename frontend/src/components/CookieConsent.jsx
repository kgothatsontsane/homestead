import { X } from "lucide-react";
import { useEffect, useState } from "react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true and unchangeable
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    } else {
      setPreferences(JSON.parse(consent));
    }
  }, []);

  const savePreferences = (acceptAll = false) => {
    const newPreferences = acceptAll
      ? { necessary: true, analytics: true, marketing: true, functional: true }
      : preferences;

    localStorage.setItem("cookieConsent", JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const togglePreference = (key) => {
    if (key === "necessary") return; // Cannot disable necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Main Banner */}
      {showBanner && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Cookie Preferences
                </h3>
                <p className="text-gray-600">
                  We use cookies to enhance your browsing experience, serve
                  personalized content, and analyze our traffic.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Cookie Settings
                </button>
                <button
                  onClick={() => savePreferences(true)}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={() => savePreferences(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Accept Necessary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Cookie Settings
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {Object.entries({
                necessary: {
                  title: "Necessary Cookies",
                  description:
                    "Essential cookies that enable basic functionality and security features.",
                  required: true,
                },
                functional: {
                  title: "Functional Cookies",
                  description:
                    "Enable enhanced functionality and personalization.",
                  required: false,
                },
                analytics: {
                  title: "Analytics Cookies",
                  description:
                    "Help us understand how visitors interact with our website.",
                  required: false,
                },
                marketing: {
                  title: "Marketing Cookies",
                  description:
                    "Used to track visitors across websites for marketing purposes.",
                  required: false,
                },
              }).map(([key, { title, description, required }]) => (
                <div key={key} className="flex items-start space-x-4">
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={preferences[key]}
                      onChange={() => togglePreference(key)}
                      disabled={required}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{title}</h3>
                      {required && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => savePreferences(false)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
