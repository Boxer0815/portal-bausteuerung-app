import { Tabs } from 'expo-router';
import { Text, useColorScheme } from 'react-native';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.5 }}>
      {emoji}
    </Text>
  );
}

export default function TabsLayout() {
  const dunkel = useColorScheme() === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1A56DB',
        tabBarInactiveTintColor: dunkel ? '#888' : '#999',
        tabBarStyle: {
          backgroundColor: dunkel ? '#1C1C1E' : '#F9FAFB',
          borderTopColor: dunkel ? '#2C2C2E' : '#E5E7EB',
        },
        headerStyle: {
          backgroundColor: dunkel ? '#1C1C1E' : '#F9FAFB',
        },
        headerTintColor: dunkel ? '#FFF' : '#111827',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Meine Termine',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
