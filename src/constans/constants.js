import { SplashNavigation, BottomTabBar } from '../components/navigation/index'

export const ColorApp = {
  primary: '#5559F4',
  placeholder: '#808191',
  font: '#111621',
  input: '#F5F5F5',
};

export const routes = {
  general: [
    {
      name: "SplashStack",
      component: SplashNavigation,
      routes: [
        {
          name: "Splash",
        },
        {
          name: "Language",
        }
      ]
    }
  ],
  public: [
    {
      name: "BottomTab",
      component: BottomTabBar,
      routes: [
        {
          name: "Courses",
          // component:
        }
      ]
    }
  ],
  private: [
    {
      name: "BottomTab",
      component: BottomTabBar,
      routes: [
        {
          name: "Courses",
          // component:
        }
      ]
    }
  ],
}