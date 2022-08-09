import React from 'react';
import { View } from 'react-native';
import { SplashNavigation, BottomTabBar } from '.';
import { coursesOFF, coursesON, myCoursesOFF, myCoursesON, profileOFF, profileON, tasksOFF, tasksON, testsOFF, testsON } from '../../assets/icons';
import { strings } from '../../localization';
import CoursesScreen from '../../screens/bottomtab/courses/CoursesScreen';
import TestsScreen from "../../screens/bottomtab/tests/TestsScreen"
import MyCoursesScreen from "../../screens/bottomtab/myCourses/MyCoursesScreen"
import TasksScreen from "../../screens/bottomtab/tasks/TasksScreen"
import ProfileScreen from "../../screens/bottomtab/profile/ProfileScreen"
import LanguageScreen from '../../screens/splash/LanguageScreen';
import SplashScreen from '../../screens/splash/SplashScreen';


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
            icon: {
              active: coursesON,
              inactive: coursesOFF
            },
            label: strings.Курсы,
            component: CoursesScreen,
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
            component: TestsScreen,
            icon: {
              active: testsON,
              inactive: testsOFF
            },
            label: strings.Тесты, 
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
            component: MyCoursesScreen,
            icon: {
              active: myCoursesON,
              inactive: myCoursesOFF,
            },
            label: strings['Мои курсы'],
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
            component: TasksScreen,
            icon: {
              active: tasksON,
              inactive: tasksOFF
            },
            label: strings.Задания,
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
            component: ProfileScreen,
            icon: {
              active: profileON,
              inactive: profileOFF
            },
            label: strings.Профиль,
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


export const BOTTOM_TAB_OPTIONS = () => {
  
}