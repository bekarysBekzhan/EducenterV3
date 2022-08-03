import React from 'react';
import { View } from 'react-native';
import { SplashNavigation, BottomTabBar } from '../components/navigation/index'
import LanguageScreen from '../screens/LanguageScreen';
import SplashScreen from '../screens/SplashScreen';

export const ColorApp = {
  primary: '#5559F4',
  placeholder: '#808191',
  font: '#111621',
  input: '#F5F5F5',
};

export const baseURL = "https://demo.educenter.kz/api/v2/"
export const URLS = {
  mobileSettings: "settings/mobile",
  
}

export const routeNames = {
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

export const routes = {
  general: [
    {
      name: "SplashStack",
      component: SplashNavigation,
      routes: [
        {
          name: routeNames.splash,
          component: SplashScreen
        },
        {
          name: routeNames.language,
          component: LanguageScreen
        }
      ]
    }
  ],
  public: [
    {
      name: routeNames.bottomTab,
      component: BottomTabBar,
      routes: [
        {
          name: routeNames.coursesStack,
          component: <View/>,
          routes: [
            {
              name: routeNames.courses,
              component: <View/>,
            },
            {
              name: routeNames.courseDetail,
              component: <View/>,
            }
          ]
        },
        {
          name: routeNames.testsStack,
          component: <View/>,
          routes: [
            {
              name: routeNames.tests,
              component: <View/>,
            },
            {
              name: routeNames.testDetail,
              component: <View/>,
            }
          ]
        },
        {
          name: routeNames.myCoursesStack,
          component: <View/>,
          routes: [
            {
              name: routeNames.myCoursesTopBar,
              component: <View/>,
              routes: [
                {
                  name: routeNames.myCourses,
                  component: <View/>
                },
                {
                  name: routeNames.myTests,
                  component: <View/>
                },
                {
                  name: routeNames.myTasks,
                  component: <View/>
                }
              ]
            },
            {
              name: routeNames.myTestDetail,
              component: <View/>,
            },
            {
              name: routeNames.myCourseDetail,
              component: <View/>
            },
            {

            }
          ]
        },
        {
          name: routeNames.tasksStack,
          component: <View/>,
          routes: [
            {
              name: routeNames.tasks,
              component: <View/>,
            },
            {
              name: routeNames.taskDetail,
              component: <View/>,
            }
          ]
        },
        {
          name: routeNames.menuStack,
          component: <View/>,
          routes: [
            {
              name: routeNames.menu,
              component: <View/>,
            },
            {
              name: routeNames.journal,
              component: <View/>,
            },
            {
              name: routeNames.rating,
              component: <View/>,
            },
            {
              name: routeNames.refProgram,
              component: <View/>,
            },
            {
              name: routeNames.news,
              component: <View/>,
            },
            {
              name: routeNames.privacyPolicy,
              component: <View/>,
            },
            {
              name: routeNames.aboutService,
              component: <View/>,
            }
          ]
        }
      ]
    },
    // {
    //   name: routeNames.search,
    //   component: <View/>
    // },
    // {
    //   name: routeNames.courseReview,
    //   component: <View/>
    // },
    // {
    //   name: routeNames.courseLeaveReview,
    //   component: <View/>
    // },
    // {
    //   name: routeNames.courseFinish,
    //   component: <View/>
    // },
    // {
    //   name: routeNames.payment,
    //   component: <View/>
    // },
    // {
    //   name: routeNames.testPreview,
    //   component: <View/>
    // },
    // {
    //   name: routeNames.testPass,
    //   component: <View/>
    // },
    // {
    //   name: routeNames.testResult,
    //   component: <View/>
    // },
    // {
    //   name: routeNames.testFinish,
    //   component: <View/>
    // },
    // {
    //   name: routeNames.taskOpen,
    //   component: <View/>
    // }
  ],
  private: [
    {
      name: "BottomTab",
      component: BottomTabBar,
      routes: [
        
      ]
    }
  ],
}