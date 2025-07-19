import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function RequestHistoryScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="titleLarge">Request History Screen</Text>
      {/* TODO: List requests and allow cancellation */}
    </View>
  );
} 