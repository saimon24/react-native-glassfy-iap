import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/pages/Home';
import { GlassfyProvider } from './app/providers/GlassfyProvider';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GlassfyProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Glassfy React Native" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlassfyProvider>
  );
}
