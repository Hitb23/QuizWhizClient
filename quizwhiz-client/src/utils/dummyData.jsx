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
  const Category=[
    {
      title:"Test Your Knowledge",
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate, tempora',
      date:"12-08-2024",
      time: "12:00 PM"
    },
    {
      title:"Unlock Your Genius!",
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate, tempora',
      date:"12-08-2024",
      time: "12:00 PM"
    },
    {
      title:"Quiz Your Way to the Top!",
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate, tempora',
      date:"12-08-2024",
      time: "12:00 PM"
    },
    {
      title:"Brain Games for Bright Minds!",
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate, tempora',
      date:"12-08-2024",
      time: "12:00 PM"
    },
    // {
    //   title:"Web development",
    //   description: "Lorem ipsum ue natus  rerum asperiores commodi architecto incidunt, itaque qui, quo eligendi impedit nam alias. Eum, consequuntur consectetur!",
    //   date:"12-08-2024 12:00"
    // },
    // {
    //   title:"Android Development",
    //   description: "Lorem ipsum ue natus  rerum asperiores commodi architecto incidunt, itaque qui, quo eligendi impedit nam alias. Eum, consequuntur consectetur!",
    //   date:"12-08-2024 12:00"
    // }

  ]
export { adminDashboardSections,Category}