import React from 'react';
import { View } from 'react-native';
import { SplashNavigation, BottomTabBar } from '../components/navigation/index'
import LanguageScreen from '../screens/LanguageScreen';
import SplashScreen from '../screens/SplashScreen';

export const APP_COLORS = {
  primary: '#5559F4',
  placeholder: '#808191',
  font: '#111621',
  input: '#F5F5F5',
};

export const DOMAIN = "https://demo.educenter.kz"
export const REQUEST_HEADERS = {
  'Accept': 'application/json'
}
export const URLS = {
  mobileSettings: "settings/mobile",
}

export const ROUTE_NAMES = {
  // MAIN STACK SCREENS
  search: "Search",
  courseReview: "CourseReview",
  courseLeaveReview: "CourseLeaveReview",
  courseFinish: "CourseFinish",
  payment: "Payment",
  splashStack: "SplashStack",
  lesson: "Lesson",
  myLesson: "MyLesson",
  testPreview: "TestPreview",
  testPass: "TestPass",
  myTestPass: "MyTestPass",
  testResult: "TestResult",
  myTestResult: "MyTestResult",
  testFinish: "TestFinish",
  taskOpen: "TaskOpen",
  bottomTab: "BottomTab",
  // SPLASH STACK SCREENS
  splash: "Splash",
  language: "Language",
  // BOTTOM BAR SCREENS
  coursesStack: "CoursesStack",
  testsStack: "TestsStack",
  myCoursesStack: "MyCoursesStack",
  tasksStack: "TasksStack",
  menuStack: "MenuStack",
  // TABS
  // Courses
  courses: "Courses",
  courseDetail: "CourseDetail",
  // Tests
  tests: "Tests",
  testDetail: "TestDetail",
  // My Courses
  myCourses: "MyCourses",
  myTests: "MyTests",
  myTasks: "MyTasks",
  myCourseDetail: "MyCourseDetail",
  testsTopBar: "TestsTopBar",
  myCoursesTopBar: "MyCoursesTopBar",
  myTestDetail: "MyTestDetail",
  // Tasks
  tasks: "Tasks",
  taskDetail: "TaskDetail",
  // Menu
  menu: "Menu",
  journal: "Journal",
  rating: "Rating",
  refProgram: "RefProgram",
  news: "News",
  privacyPolicy: "PrivacyPolicy",
  aboutService: "AboutService",
}

export const ROUTES = {
  general: [
    {
      name: "SplashStack",
      component: SplashNavigation,
      ROUTES: [
        {
          name: ROUTE_NAMES.splash,
          component: SplashScreen
        },
        {
          name: ROUTE_NAMES.language,
          component: LanguageScreen
        }
      ]
    }
  ],
  public: [
    {
      name: ROUTE_NAMES.bottomTab,
      component: BottomTabBar,
      ROUTES: [
        {
          name: ROUTE_NAMES.coursesStack,
          component: <View/>,
          ROUTES: [
            {
              name: ROUTE_NAMES.courses,
              component: <View/>,
            },
            {
              name: ROUTE_NAMES.courseDetail,
              component: <View/>,
            }
          ]
        },
        {
          name: ROUTE_NAMES.testsStack,
          component: <View/>,
          ROUTES: [
            {
              name: ROUTE_NAMES.tests,
              component: <View/>,
            },
            {
              name: ROUTE_NAMES.testDetail,
              component: <View/>,
            }
          ]
        },
        {
          name: ROUTE_NAMES.myCoursesStack,
          component: <View/>,
          ROUTES: [
            {
              name: ROUTE_NAMES.myCoursesTopBar,
              component: <View/>,
              ROUTES: [
                {
                  name: ROUTE_NAMES.myCourses,
                  component: <View/>
                },
                {
                  name: ROUTE_NAMES.myTests,
                  component: <View/>
                },
                {
                  name: ROUTE_NAMES.myTasks,
                  component: <View/>
                }
              ]
            },
            {
              name: ROUTE_NAMES.myTestDetail,
              component: <View/>,
            },
            {
              name: ROUTE_NAMES.myCourseDetail,
              component: <View/>
            },
            {

            }
          ]
        },
        {
          name: ROUTE_NAMES.tasksStack,
          component: <View/>,
          ROUTES: [
            {
              name: ROUTE_NAMES.tasks,
              component: <View/>,
            },
            {
              name: ROUTE_NAMES.taskDetail,
              component: <View/>,
            }
          ]
        },
        {
          name: ROUTE_NAMES.menuStack,
          component: <View/>,
          ROUTES: [
            {
              name: ROUTE_NAMES.menu,
              component: <View/>,
            },
            {
              name: ROUTE_NAMES.journal,
              component: <View/>,
            },
            {
              name: ROUTE_NAMES.rating,
              component: <View/>,
            },
            {
              name: ROUTE_NAMES.refProgram,
              component: <View/>,
            },
            {
              name: ROUTE_NAMES.news,
              component: <View/>,
            },
            {
              name: ROUTE_NAMES.privacyPolicy,
              component: <View/>,
            },
            {
              name: ROUTE_NAMES.aboutService,
              component: <View/>,
            }
          ]
        }
      ]
    },
    // {
    //   name: ROUTE_NAMES.search,
    //   component: <View/>
    // },
    // {
    //   name: ROUTE_NAMES.courseReview,
    //   component: <View/>
    // },
    // {
    //   name: ROUTE_NAMES.courseLeaveReview,
    //   component: <View/>
    // },
    // {
    //   name: ROUTE_NAMES.courseFinish,
    //   component: <View/>
    // },
    // {
    //   name: ROUTE_NAMES.payment,
    //   component: <View/>
    // },
    // {
    //   name: ROUTE_NAMES.testPreview,
    //   component: <View/>
    // },
    // {
    //   name: ROUTE_NAMES.testPass,
    //   component: <View/>
    // },
    // {
    //   name: ROUTE_NAMES.testResult,
    //   component: <View/>
    // },
    // {
    //   name: ROUTE_NAMES.testFinish,
    //   component: <View/>
    // },
    // {
    //   name: ROUTE_NAMES.taskOpen,
    //   component: <View/>
    // }
  ],
  private: [
    {
      name: "BottomTab",
      component: BottomTabBar,
      ROUTES: [
        
      ]
    }
  ],
}