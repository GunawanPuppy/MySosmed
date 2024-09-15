import HomeScreen from "../Screens/Home";
import SearchScreen from "../Screens/Search";
import ProfileScreen from "../Screens/Profile";
import AddPostScreen from "../Screens/AddPost";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Homes") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          } else if (route.name === "AddPost") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#708090', // Change this to your desired grey color
        },
      })}
    >
      <Tab.Screen name="Homes" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="AddPost" component={AddPostScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
