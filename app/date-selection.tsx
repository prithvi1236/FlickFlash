import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function DateSelectionScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="titleLarge">Date Selection Screen</Text>
      {/* TODO: Implement date picker restricted to allowed range */}
    </View>
  );
} 