import QuizIcon from '@mui/icons-material/Quiz';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
const adminDashboardSections = [
    {
      title: 'Quiz Management',
      icon: <QuizIcon />// Icon for quiz management
    },
    {
      title: 'User Management',
      icon: <GroupIcon /> // Icon for user management
    },
    {
      title: 'Result and Analytics',
      icon: <BarChartIcon /> // Icon for result and analytics
    },
    {
      title: 'Settings',
      icon: <SettingsIcon /> // Icon for settings
    }
  ];
  
export { adminDashboardSections}