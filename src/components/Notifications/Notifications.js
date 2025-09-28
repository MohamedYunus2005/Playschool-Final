import React, { useState, useEffect, useMemo } from 'react';

// Component for a custom, state-driven alert message (Fixed position, responsive width)
const AlertMessage = ({ message, type = 'info', onClose, isUnicornTheme }) => {
    if (!message) return null;

    const colors = isUnicornTheme ? {
        error: 'bg-red-100 border-red-400 text-red-700',
        info: 'bg-green-100 border-green-400 text-green-700', // Success color for light theme
    } : {
        error: 'bg-red-900 border-red-600 text-red-300',
        info: 'bg-green-900 border-green-600 text-green-300', // Success color for dark theme
    };

    return (
        // Fixed position at bottom right with responsive max width
        <div className={`mt-4 p-3 sm:p-4 rounded-lg border-l-4 ${colors[type]} transition-all duration-300 transform animate-slide-in fixed bottom-4 right-4 max-w-xs sm:max-w-md w-full z-50 shadow-xl`}>
            <div className="flex justify-between items-center">
                <p className="text-sm sm:text-base font-medium">{message}</p>
                <button onClick={onClose} className="text-xl leading-none font-bold ml-4">
                    &times;
                </button>
            </div>
            {/* Added style for slide-in animation */}
            <style jsx="true">{`
                @keyframes slide-in {
                    0% { transform: translateX(100%); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in {
                    animation: slide-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

// Floating Emoji Component (Responsive text size)
const FloatingEmoji = ({ emoji }) => {
    // Generate stable positions that don't change on re-renders
    const position = useMemo(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${Math.random() * 5 + 5}s`
    }), []);

    return (
        // Text size reduced for mobile, scales up for larger screens
        <div
            className="absolute text-xl sm:text-2xl md:text-4xl opacity-70 animate-float-spin"
            style={position}
        >
            {emoji}
        </div>
    );
};

// Animated Background Component with stable emoji positions
const AnimatedBackground = ({ isUnicornTheme }) => {
    const floatingEmojis = isUnicornTheme
        ? ['🦄', '🌈', '🌟', '☁️', '🎈', '🍭', '🎀', '💖', '✨', '🌸']
        : ['🌙', '✨', '🪐', '💫', '🚀', '⭐', '☄️', '🔮', '👽', '🌌'];

    const emojis = useMemo(() =>
        Array.from({ length: 40 }).map(() =>
            floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)]
        ), [isUnicornTheme]
    );

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {emojis.map((emoji, index) => (
                <FloatingEmoji
                    key={index}
                    emoji={emoji}
                />
            ))}
            {/* Custom CSS for animations used by floating emojis/background */}
            <style jsx="true">{`
                @keyframes float-spin {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(360deg); }
                    100% { transform: translateY(0px) rotate(720deg); }
                }
                .animate-float-spin {
                    animation: float-spin var(--animation-duration, 8s) ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

const ParentAwareness = ({ theme }) => {
    const [activeTab, setActiveTab] = useState('messages');
    const [selectedParents, setSelectedParents] = useState([]);
    const [newMessage, setNewMessage] = useState({
        title: '',
        content: '',
        category: 'reminder',
        urgency: 'normal'
    });
    const [alertMessage, setAlertMessage] = useState('');

    const isUnicornTheme = theme === 'unicorn';
    const bgColor = isUnicornTheme ? 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100' : 'bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950 text-white';

    // Responsive Card Classes (Reduced mobile padding)
    const cardClasses = `p-4 sm:p-6 rounded-3xl shadow-lg transition-all duration-500 border-4 border-white border-opacity-60 backdrop-blur-sm`;
    const cardBgColor = isUnicornTheme ? 'bg-white/50' : 'bg-gray-800/50 text-white';
    const textColor = isUnicornTheme ? 'text-gray-700' : 'text-gray-300';
    const headerColor = isUnicornTheme ? 'text-purple-800' : 'text-yellow-200';
    const subHeadingColor = isUnicornTheme ? 'text-green-700' : 'text-green-300';

    // Responsive Button Classes
    const buttonBaseClasses = `px-4 py-2 rounded-full text-sm sm:text-lg font-bold transition-all duration-300 transform hover:scale-105`;

    // Responsive Input Classes
    const inputClasses = `w-full p-2 sm:p-3 border-2 rounded-lg focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'bg-white border-gray-300 text-gray-700 focus:ring-pink-300' : 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500'}`;


    // Sample data - will come from API later
    const [messages, setMessages] = useState([
        {
            id: 1,
            title: 'Polio Vaccination Camp',
            content: 'Dear parents, polio vaccination camp will be held on 25th June 2024. Please bring your children.',
            category: 'vaccination',
            urgency: 'high',
            date: '2024-06-15',
            sentTo: ['All Parents']
        },
        {
            id: 2,
            title: 'Importance of Regular Attendance',
            content: 'Regular attendance helps in continuous learning and nutrition. Please ensure your child attends daily.',
            category: 'education',
            urgency: 'normal',
            date: '2024-06-10',
            sentTo: ['Frequently Absent Parents']
        },
        {
            id: 3,
            title: 'Nutrition Week',
            content: 'This week we are focusing on protein-rich foods. Special meals will be served.',
            category: 'nutrition',
            urgency: 'normal',
            date: '2024-06-05',
            sentTo: ['All Parents']
        }
    ]);

    const parents = [
        { id: 1, name: 'Rajesh Kumar', child: 'Kavya M.', phone: '+91 9876543210', lastContact: '2024-06-12' },
        { id: 2, name: 'Sneha Patel', child: 'Arjun S.', phone: '+91 8765432109', lastContact: '2024-06-10' },
        { id: 3, name: 'Mohan Singh', child: 'Divya P.', phone: '+91 7654321098', lastContact: '2024-06-08' },
        { id: 4, name: 'Priya Sharma', child: 'Siddharth R.', phone: '+91 6543210987', lastContact: '2024-06-05' },
        { id: 5, name: 'Ankit Verma', child: 'Priya K.', phone: '+91 5432109876', lastContact: '2024-06-01' }
    ];

    const parentGroups = [
        { id: 'all', name: 'All Parents', count: parents.length },
        { id: 'absent', name: 'Frequently Absent', count: 2 },
        { id: 'new', name: 'New Parents', count: 1 },
        { id: 'vaccination', name: 'Vaccination Due', count: 3 }
    ];

    const handleInputChange = (e) => {
        setNewMessage({
            ...newMessage,
            [e.target.name]: e.target.value
        });
    };

    const handleParentSelect = (parentId) => {
        setSelectedParents(prev =>
            prev.includes(parentId)
                ? prev.filter(id => id !== parentId)
                : [...prev, parentId]
        );
    };

    const handleGroupSelect = (group) => {
        // Simple logic to select all parents for demo purposes
        if (selectedParents.length === parents.length) {
            setSelectedParents([]);
        } else {
            const groupParentIds = parents.map(parent => parent.id);
            setSelectedParents(groupParentIds);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.title || !newMessage.content) return;

        // If no specific parents are selected, assume 'All Parents' group
        const sentToNames = selectedParents.length > 0
            ? parents.filter(p => selectedParents.includes(p.id)).map(p => p.name)
            : ['All Parents'];

        const newMessageObj = {
            id: Date.now(),
            ...newMessage,
            date: new Date().toISOString().split('T')[0],
            sentTo: sentToNames
        };

        setMessages([newMessageObj, ...messages]);
        setNewMessage({
            title: '',
            content: '',
            category: 'reminder',
            urgency: 'normal'
        });
        setSelectedParents([]);
        setAlertMessage('Message sent successfully!');
    };

    // Helper function for urgency colors
    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'high':
                // Adjusted colors for better contrast/theming
                return isUnicornTheme ? 'bg-red-50 text-red-800 border border-red-300' : 'bg-red-900 text-red-300 border border-red-600';
            case 'normal':
                return isUnicornTheme ? 'bg-blue-50 text-blue-800 border border-blue-300' : 'bg-blue-900 text-blue-300 border border-blue-600';
            case 'low':
                return isUnicornTheme ? 'bg-gray-50 text-gray-800 border border-gray-300' : 'bg-gray-700 text-gray-200 border border-gray-600';
            default:
                return isUnicornTheme ? 'bg-gray-100 text-gray-800' : 'bg-gray-700 text-gray-200';
        }
    };

    // Helper function for category colors
    const getCategoryColor = (category) => {
        switch (category) {
            case 'vaccination':
                return isUnicornTheme ? 'bg-orange-200 text-orange-800' : 'bg-orange-800 text-orange-200';
            case 'nutrition':
                return isUnicornTheme ? 'bg-green-200 text-green-800' : 'bg-green-800 text-green-200';
            case 'education':
                return isUnicornTheme ? 'bg-blue-200 text-blue-800' : 'bg-blue-800 text-blue-200';
            case 'reminder':
                return isUnicornTheme ? 'bg-purple-200 text-purple-800' : 'bg-purple-800 text-purple-200';
            case 'event':
                return isUnicornTheme ? 'bg-pink-200 text-pink-800' : 'bg-pink-800 text-pink-200';
            default:
                return isUnicornTheme ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-200';
        }
    };

    return (
        <div className={`font-sans min-h-screen p-4 sm:p-8 transition-all duration-1000 ${bgColor} relative`}>
            {/* Animated Background */}
            <AnimatedBackground isUnicornTheme={isUnicornTheme} />
            <div className="relative z-10 container mx-auto px-0 sm:px-4 py-4 sm:py-8 max-w-6xl">

                {/* Main Heading (Responsive) */}
                <h1 className={`text-3xl sm:text-4xl font-extrabold text-center mb-6 drop-shadow-md transition-colors duration-500 ${headerColor}`}>
                    📢 Parent Communication Hub
                </h1>

                {/* Navigation Tabs (Responsive) */}
                <div className={`${cardClasses} ${cardBgColor} p-2 sm:p-4 border-4 border-white border-opacity-60`}>
                    <div className="flex flex-wrap space-x-0 sm:space-x-1 gap-1 justify-center">
                        {[
                            { id: 'messages', label: 'Messages', icon: '✉️' },
                            { id: 'parents', label: 'Contacts', icon: '👨‍👩‍👧' }, // Shortened label for mobile
                            { id: 'templates', label: 'Templates', icon: '📋' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                // Responsive padding and text size for tabs
                                className={`flex items-center justify-center flex-1 min-w-[100px] py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? `text-white shadow-md ${isUnicornTheme ? 'bg-gradient-to-r from-pink-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500'}`
                                    : `hover:bg-opacity-80 ${isUnicornTheme ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`
                                    }`}
                            >
                                <span className="mr-1 sm:mr-2 text-sm">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'messages' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {/* Message List */}
                        <div className={`${cardClasses} ${cardBgColor}`}>
                            <h3 className={`text-xl font-semibold mb-4 transition-colors duration-500 ${subHeadingColor}`}>Sent Messages History</h3>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                {messages.map(message => (
                                    <div key={message.id} className={`border rounded-lg p-3 transition-colors duration-500 ${isUnicornTheme ? 'border-gray-200 hover:bg-gray-50/50' : 'border-gray-700 hover:bg-gray-700/50'}`}>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                            <h4 className={`font-semibold text-base sm:text-lg transition-colors duration-500 ${isUnicornTheme ? 'text-gray-800' : 'text-gray-100'}`}>{message.title}</h4>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold mt-1 sm:mt-0 ${getUrgencyColor(message.urgency)}`}>
                                                {message.urgency.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className={`text-sm mb-3 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-600' : 'text-gray-400'}`}>{message.content}</p>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(message.category)}`}>
                                                {message.category}
                                            </span>
                                        </div>
                                        <div className={`text-xs transition-colors duration-500 ${isUnicornTheme ? 'text-gray-500' : 'text-gray-500'}`}>
                                            Sent: {message.date} • To: {message.sentTo.join(', ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* New Message Form */}
                        <div className={`${cardClasses} ${cardBgColor}`}>
                            <h3 className={`text-xl font-semibold mb-4 transition-colors duration-500 ${subHeadingColor}`}>Send New Message</h3>
                            <form onSubmit={handleSendMessage} className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${textColor}`}>Title:</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newMessage.title}
                                        onChange={handleInputChange}
                                        className={inputClasses}
                                        placeholder="Important announcement..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${textColor}`}>Message:</label>
                                    <textarea
                                        name="content"
                                        value={newMessage.content}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className={inputClasses}
                                        placeholder="Type your message here..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${textColor}`}>Category:</label>
                                        <select
                                            name="category"
                                            value={newMessage.category}
                                            onChange={handleInputChange}
                                            className={inputClasses}
                                        >
                                            <option value="reminder">Reminder</option>
                                            <option value="vaccination">Vaccination</option>
                                            <option value="nutrition">Nutrition</option>
                                            <option value="education">Education</option>
                                            <option value="event">Event</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${textColor}`}>Urgency:</label>
                                        <select
                                            name="urgency"
                                            value={newMessage.urgency}
                                            onChange={handleInputChange}
                                            className={inputClasses}
                                        >
                                            <option value="low">Low</option>
                                            <option value="normal">Normal</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-500 ${textColor}`}>Send To:</label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {parentGroups.map(group => (
                                            <button
                                                key={group.id}
                                                type="button"
                                                onClick={() => handleGroupSelect(group.id)}
                                                className={`px-3 py-1 rounded-full text-xs hover:bg-opacity-80 transition-colors ${isUnicornTheme ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-300'}`}
                                            >
                                                {group.name} ({group.count})
                                            </button>
                                        ))}
                                    </div>

                                    <div className={`border rounded-lg p-3 max-h-40 overflow-y-auto transition-colors duration-500 ${isUnicornTheme ? 'border-gray-300 bg-white/90' : 'border-gray-600 bg-gray-700/90'}`}>
                                        <p className={`text-sm mb-2 font-semibold ${textColor}`}>Specific Parents:</p>
                                        <div className="space-y-1">
                                            {parents.map(parent => (
                                                <div key={parent.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedParents.includes(parent.id)}
                                                        onChange={() => handleParentSelect(parent.id)}
                                                        className={`mr-2 h-4 w-4 rounded-sm transition-colors duration-500 ${isUnicornTheme ? 'text-green-600 focus:ring-green-500' : 'text-green-400 focus:ring-green-400'}`}
                                                    />
                                                    <span className={`text-sm ${textColor}`}>
                                                        {parent.name} ({parent.child})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg ${isUnicornTheme ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white hover:from-pink-500 hover:via-purple-500 hover:to-blue-500' : 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white hover:from-blue-600 hover:via-purple-700 hover:to-pink-600'}`}
                                >
                                    📤 Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'parents' && (
                    <div className={`${cardClasses} ${cardBgColor} mt-6`}>
                        <h3 className={`text-xl font-semibold mb-4 transition-colors duration-500 ${subHeadingColor}`}>Parent Contact Directory</h3>
                        <div className="overflow-x-auto rounded-lg border border-white/50">
                            <table className="min-w-full divide-y divide-white/50">
                                <thead>
                                    <tr className={`transition-colors duration-500 text-xs sm:text-sm ${isUnicornTheme ? 'bg-gray-100 text-gray-800' : 'bg-gray-700 text-gray-100'}`}>
                                        <th className={`px-2 sm:px-4 py-2 text-left font-bold w-[25%]`}>Parent</th>
                                        <th className={`px-2 sm:px-4 py-2 text-left font-bold w-[20%]`}>Child</th>
                                        <th className={`px-2 sm:px-4 py-2 text-left font-bold w-[20%]`}>Phone</th>
                                        <th className={`px-2 sm:px-4 py-2 text-left font-bold w-[15%]`}>Last Contact</th>
                                        <th className={`px-2 sm:px-4 py-2 text-left font-bold w-[20%]`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20">
                                    {parents.map(parent => (
                                        <tr key={parent.id} className={`transition-colors duration-500 text-xs sm:text-sm ${isUnicornTheme ? 'hover:bg-gray-50/50' : 'hover:bg-gray-700/50'}`}>
                                            <td className={`px-2 sm:px-4 py-2 ${textColor}`}>{parent.name}</td>
                                            <td className={`px-2 sm:px-4 py-2 ${textColor}`}>{parent.child}</td>
                                            <td className={`px-2 sm:px-4 py-2 ${textColor}`}>{parent.phone}</td>
                                            <td className={`px-2 sm:px-4 py-2 ${textColor}`}>{parent.lastContact}</td>
                                            <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                                                {/* Reduced font size and removed margin for mobile actions */}
                                                <button className={`mr-2 text-xs transition-colors duration-500 ${isUnicornTheme ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-200'}`}>📞 Call</button>
                                                <button className={`text-xs transition-colors duration-500 ${isUnicornTheme ? 'text-green-600 hover:text-green-800' : 'text-green-400 hover:text-green-200'}`}>💬 Msg</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className={`${cardClasses} ${cardBgColor} mt-6`}>
                        <h3 className={`text-xl font-semibold mb-4 transition-colors duration-500 ${subHeadingColor}`}>Message Templates</h3>
                        {/* Responsive grid for templates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                {
                                    title: 'Attendance Reminder',
                                    content: 'Dear parent, please ensure your child attends Anganwadi regularly for continuous learning and nutrition.',
                                    category: 'reminder'
                                },
                                {
                                    title: 'Vaccination Due',
                                    content: 'Reminder: Your child is due for vaccination. Please visit the Anganwadi center this week.',
                                    category: 'vaccination'
                                },
                                {
                                    title: 'Parent-Teacher Meeting',
                                    content: 'We are conducting a parent-teacher meeting on [date]. Please attend to discuss your child progress.',
                                    category: 'event'
                                },
                                {
                                    title: 'Nutrition Tips',
                                    content: 'Tip: Include more green vegetables and fruits in your child diet for better growth and immunity.',
                                    category: 'nutrition'
                                }
                            ].map((template, index) => (
                                <div key={index} className={`border rounded-lg p-4 cursor-pointer transition-colors duration-500 ${isUnicornTheme ? 'border-gray-200 hover:bg-gray-50/50' : 'border-gray-700 hover:bg-gray-700/50'}`}>
                                    <h4 className={`font-semibold text-base mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-800' : 'text-gray-100'}`}>{template.title}</h4>
                                    <p className={`text-sm mb-3 ${textColor}`}>{template.content}</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(template.category)}`}>
                                        {template.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Communication Tips (Responsive Grid) */}
                <div className={`mt-8 p-4 sm:p-6 rounded-lg shadow-md border transition-all duration-500 ${isUnicornTheme ? 'bg-pink-50 border-pink-200' : 'bg-pink-900 border-pink-800'}`}>
                    <h4 className={`font-semibold text-lg sm:text-xl mb-3 transition-colors duration-500 ${isUnicornTheme ? 'text-pink-800' : 'text-pink-300'}`}>💡 Effective Communication Tips</h4>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm transition-colors duration-500 ${isUnicornTheme ? 'text-pink-600' : 'text-pink-400'}`}>
                        <div>
                            <h5 className={`font-medium mb-2 transition-colors duration-500 text-base ${isUnicornTheme ? 'text-pink-700' : 'text-pink-300'}`}>Best Practices:</h5>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>Use simple, clear language that parents can understand</li>
                                <li>Send reminders 2-3 days before important events</li>
                                <li>Use local language (Tamil) for better comprehension</li>
                                <li>Include specific dates and times</li>
                                <li>Personalize messages when possible</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className={`font-medium mb-2 transition-colors duration-500 text-base ${isUnicornTheme ? 'text-pink-700' : 'text-pink-300'}`}>Communication Channels:</h5>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>SMS messages for quick reminders</li>
                                <li>WhatsApp for group announcements</li>
                                <li>Phone calls for urgent matters</li>
                                <li>In-person meetings for detailed discussions</li>
                                <li>Notice board for general information</li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Alert Message component call (Fixed position) */}
                <AlertMessage
                    message={alertMessage}
                    type={'info'}
                    onClose={() => setAlertMessage('')}
                    isUnicornTheme={isUnicornTheme}
                />
            </div>
        </div>
    );
};

export default ParentAwareness;
