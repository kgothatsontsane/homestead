// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaLinkedin, FaClock, FaGlobe, FaGithub, FaInstagram, FaTelegram, FaDiscord } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';

/**
 * Custom debounce implementation with automatic cleanup
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
const createUniqueDebounce = (fn, delay) => {
  let timeoutId;
  const cleanup = () => timeoutId && clearTimeout(timeoutId);
  
  // Unique implementation that includes cleanup and immediate execution options
  return (...args) => {
    cleanup();
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, delay);
  };
};

/**
 * Unique performance monitoring thresholds based on device capabilities
 * Adjusts thresholds based on device performance
 */
const ADAPTIVE_PERFORMANCE_THRESHOLDS = {
  pageLoad: { good: 1000, acceptable: 2000 }, // 1s and 2s
  formSubmission: { good: 500, acceptable: 1000 }, // 0.5s and 1s
  LCP: { good: 2500, acceptable: 4000 }, // as per Core Web Vitals
  CLS: { good: 0.1, acceptable: 0.25 }, // as per Core Web Vitals
  deviceAdjustment: typeof window !== 'undefined' ? 
    (window.navigator.deviceMemory || 4) / 4 : 1
};

const evaluatePerformance = (metric, value) => {
  const threshold = ADAPTIVE_PERFORMANCE_THRESHOLDS[metric];
  if (!threshold) return 'unknown';
  if (value <= threshold.good) return '✅ Good';
  if (value <= threshold.acceptable) return '⚠️ Needs Improvement';
  return '❌ Poor';
};

// Memoize the background image
const heroImg = new URL('../assets/bg.jpg', import.meta.url).href;
const preloadImage = new Image();
preloadImage.src = heroImg;

/**
 * ContactInfoItem Component - Renders a contact information card with dynamic styling
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.title - Title of the contact method
 * @param {string} props.content - Contact information content
 * @param {string} props.link - URL or contact link
 */
const ContactInfoItem = memo(({ icon, title, content, link }) => {
  const colorClass = icon.props.className.match(/text-([a-z]+)-([0-9]+)/)[0];
  const bgColorClass = colorClass.replace('text-', 'bg-');
  const hoverColorClass = colorClass.replace('text-', 'hover:bg-');

  return (
    <motion.a
      href={link}
      target={link.startsWith("http") ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className={`flex items-center space-x-4 p-6 rounded-lg transition-all duration-300 
        ${hoverColorClass}/25 hover:shadow-lg group`}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`${bgColorClass}/10 p-3 rounded-full transform transition-all duration-300 
        group-hover:scale-110 group-hover:${bgColorClass}/30`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900">{title}</h3>
        <p className="text-gray-700">{content}</p>
      </div>
    </motion.a>
  );
});

// Add email validation helper
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Add retry logic helper
const retryWithBackoff = async (fn, retries = 3, backoff = 300) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, backoff));
    return retryWithBackoff(fn, retries - 1, backoff * 2);
  }
};

/**
 * Contact Page Component - Handles user inquiries and displays contact information
 * @component
 * @description A comprehensive contact page with form validation, performance monitoring,
 * and responsive design. Implements EmailJS for serverless email handling.
 */
const Contact = () => {
  // Performance monitoring refs with documentation
  /** @type {React.MutableRefObject<HTMLFormElement>} */
  const form = useRef(null);
  
  /** @type {React.MutableRefObject<number>} */
  const pageLoadTime = useRef(Date.now());
  const validateTimeoutRef = useRef(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (validateTimeoutRef.current) {
        clearTimeout(validateTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Performance monitoring
    window.scrollTo(0, 0);
    
    const loadTime = Date.now() - pageLoadTime.current;
    console.log(`Contact page load time: ${loadTime}ms - ${evaluatePerformance('pageLoad', loadTime)}`);

    // Component performance monitoring
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            console.log(`LCP: ${entry.startTime.toFixed(2)}ms - ${evaluatePerformance('LCP', entry.startTime)}`);
            break;
          case 'layout-shift':
            if (!entry.hadRecentInput) {
              const cls = entry.value;
              console.log(`CLS: ${cls.toFixed(3)} - ${evaluatePerformance('CLS', cls)}`);
            }
            break;
          default:
            console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['paint', 'layout-shift', 'largest-contentful-paint'] });

    // Device capability checks
    if (window.navigator) {
      console.log('Device Memory:', navigator.deviceMemory || 'unknown');
      console.log('Hardware Concurrency:', navigator.hardwareConcurrency);
      console.log('Network Type:', navigator.connection?.effectiveType || 'unknown');
    }

    // Memory usage logging
    if (performance?.memory) {
      console.log(`Memory Usage: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`);
    }

    // Cleanup function
    return () => {
      observer.disconnect();
      const totalTime = Date.now() - pageLoadTime.current;
      console.log(`Total page lifetime: ${totalTime}ms`);
    };
  }, []);

  // Add scroll restoration effect
  useEffect(() => {
    // Set smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Ensure page starts at top
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 100);

    return () => {
      // Reset scroll behavior on unmount
      document.documentElement.style.scrollBehavior = 'auto';
      clearTimeout(timeout);
    };
  }, []);

  // Unique form state management with type checking
  const [formState, setFormState] = useState({
    data: /** @type {Record<string, string>} */ ({}),
    errors: /** @type {Record<string, string>} */ ({}),
    isSubmitting: false,
    submitCount: 0
  });

  const validateForm = useCallback((data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = 'Name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    if (!isValidEmail(data.email)) errors.email = 'Invalid email format';
    if (!data.subject.trim()) errors.subject = 'Subject is required';
    if (!data.message.trim()) errors.message = 'Message is required';
    
    setFormState((prevState) => ({ ...prevState, errors }));
    return Object.keys(errors).length === 0;
  }, []);

  const debouncedValidation = useCallback(
    createUniqueDebounce((data) => validateForm(data), 300),
    [validateForm]
  );

  const handleChange = useCallback((e) => {
    const newFormData = { ...formState.data, [e.target.name]: e.target.value };
    setFormState((prevState) => ({ ...prevState, data: newFormData }));
    debouncedValidation(newFormData);
  }, [formState.data, debouncedValidation]);

  // Pre-initialize EmailJS to improve performance
  useEffect(() => {
    emailjs.init("woFQRIpBaxZLG85eC");
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const startTime = performance.now();
    setFormState((prevState) => ({ ...prevState, isSubmitting: true }));

    try {
      // Prepare email data outside of the retry logic
      const templateParams = {
        from_name: formState.data.name,
        from_email: formState.data.email,
        subject: formState.data.subject,
        message: formState.data.message,
      };

      const result = await emailjs.send(
        "service_1uq7mpq",
        "template_lswo8tv",
        templateParams,
        "woFQRIpBaxZLG85eC"
      );

      if (result.text === 'OK') {
        toast.success('Message sent successfully!');
        setFormState({ data: { name: '', email: '', subject: '', message: '' }, errors: {}, isSubmitting: false, submitCount: 0 });
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setFormState((prevState) => ({ ...prevState, isSubmitting: false }));
      const endTime = performance.now();
      console.log(`Form submission took: ${(endTime - startTime).toFixed(2)}ms - ${evaluatePerformance('formSubmission', endTime - startTime)}`);
    }
  }, [formState.data]);

  // Modify the input fields to show errors
  const renderInput = (field) => (
    <div key={field}>
      <label
        htmlFor={field}
        className="block text-base font-medium text-gray-800 mb-2 capitalize cursor-default"
      >
        {field}
      </label>
      <input
        type={field === "email" ? "email" : "text"}
        name={field}
        id={field}
        required
        value={formState.data[field]}
        onChange={handleChange}
        className={`w-full px-4 py-3 bg-blue-500/10 rounded-lg outline-none transition-all duration-300 focus:bg-sky-50 focus:shadow-md font-[500] placeholder:text-gray-400 cursor-default ${
          formState.errors[field] ? 'border-2 border-red-500' : ''
        }`}
        placeholder={`Enter your ${field}`}
        style={{ caretColor: 'transparent' }}
      />
      {formState.errors[field] && (
        <p className="text-red-500 text-sm mt-1 cursor-default">{formState.errors[field]}</p>
      )}
    </div>
  );

  const contactInfo = [
    {
      icon: <FaPhone className="text-2xl text-blue-500" />,
      title: "Phone",
      content: "+27 76 792 2638",
      link: "tel:+27767922638"
    },
    {
      icon: <FaWhatsapp className="text-2xl text-green-500" />,
      title: "WhatsApp",
      content: "+27 76 792 2638",
      link: "https://wa.me/27767922638"
    },
    {
      icon: <FaEnvelope className="text-2xl text-blue-500" />,
      title: "Email",
      content: "info@homestead.com",
      link: "mailto:info@homestead.com"
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-red-500" />,
      title: "Office",
      content: "Cape Town, South Africa",
      link: "https://maps.google.com"
    },
    {
      icon: <FaClock className="text-2xl text-purple-500" />,
      title: "Business Hours",
      content: "Mon-Fri: 8AM - 6PM",
      link: "#"
    },
    {
      icon: <FaGlobe className="text-2xl text-teal-500" />,
      title: "Website",
      content: "www.homestead.com",
      link: "https://www.homestead.com"
    },
    {
      icon: <FaFacebook className="text-2xl text-blue-600" />,
      title: "Facebook",
      content: "@homestead",
      link: "https://facebook.com/homestead"
    },
    {
      icon: <FaLinkedin className="text-2xl text-blue-700" />,
      title: "LinkedIn",
      content: "Homestead Real Estate",
      link: "https://linkedin.com/company/homestead"
    },
    {
      icon: <FaGithub className="text-2xl text-gray-800" />,
      title: "GitHub",
      content: "@homestead",
      link: "https://github.com/homestead"
    },
    {
      icon: <FaInstagram className="text-2xl text-pink-600" />,
      title: "Instagram",
      content: "@homestead_realty",
      link: "https://instagram.com/homestead_realty"
    },
    {
      icon: <FaTelegram className="text-2xl text-blue-500" />,
      title: "Telegram",
      content: "Join our channel",
      link: "https://t.me/homestead"
    },
    {
      icon: <FaDiscord className="text-2xl text-indigo-500" />,
      title: "Discord",
      content: "Join our community",
      link: "https://discord.gg/homestead"
    }
  ];

  return (
    <main className="relative min-h-screen">
      <div className="max-padd-container pt-32 pb-10"> {/* Top padding for header space */}
        <div className="relative rounded-xl overflow-hidden shadow-lg bg-white/5"> 
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.65)), url(${heroImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Content container with adjusted spacing */}
          <div className="relative z-10 px-6">
            <div className="max-w-7xl mx-auto space-y-12 py-16"> {/* Unified container with consistent spacing */}
              {/* Title Section */}
              <div className="text-center">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold text-gray-800 mb-4 drop-shadow-sm"
                >
                  Get in Touch
                </motion.h1>
                <p className="text-lg text-gray-700 font-medium">
                  We'd love to hear from you. Please fill out this form or contact us directly.
                </p>
              </div>

              {/* Form Grid with consistent spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-8">
                <div className="space-y-8 flex">
                  <div className="bg-white/50 backdrop-blur-md rounded-xl p-8 shadow-lg w-full border border-white/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {contactInfo.map((item, index) => (
                        <ContactInfoItem
                          key={index}
                          icon={item.icon}
                          title={item.title}
                          content={item.content}
                          link={item.link}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <motion.form
                  ref={form}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/50 backdrop-blur-md rounded-xl shadow-lg p-8 h-full border border-white/20"
                  onSubmit={handleSubmit}
                >
                  <div className="space-y-6">
                    {["name", "email", "subject"].map(renderInput)}

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-base font-medium text-gray-800 mb-2 cursor-default"
                      >
                        Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        rows={4}
                        required
                        value={formState.data.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-blue-500/10 rounded-lg outline-none transition-all duration-300 focus:bg-sky-50 focus:shadow-md font-[500] resize-none placeholder:text-gray-400 cursor-default"
                        placeholder="Enter your message"
                        style={{ caretColor: 'transparent' }}
                      />
                      {formState.errors.message && (
                        <p className="text-red-500 text-sm mt-1 cursor-default">{formState.errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={formState.isSubmitting}
                      className={`w-full btn-secondary rounded-lg py-4 px-4 text-white font-[500] transition-all duration-300 ${
                        formState.isSubmitting
                          ? "opacity-75 cursor-not-allowed"
                          : "hover:shadow-lg"
                      }`}
                    >
                      {formState.isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </motion.form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// Add performance monitoring to component
const MemoizedContact = memo(Contact);

// Add display name for debugging
MemoizedContact.displayName = 'Contact';

export default MemoizedContact;