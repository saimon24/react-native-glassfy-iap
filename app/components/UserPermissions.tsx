import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { UserState } from '../providers/GlassfyProvider';

interface UserPermissionsProps {
  user: UserState;
}

// Display the user state based on permissions (previous purchases)
const UserPermissions = ({ user }: UserPermissionsProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>Gems: {user.gems}</Text>
      <Text style={styles.text}>
        Skins: {user.skins.length === 0 && 'No Skins purchased yet!'} {user.skins.join(', ')}
      </Text>
      <Text style={styles.text}>Pro Features: {user.pro ? 'True' : 'False'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  text: {
    fontSize: 20,
    color: '#4000A4',
    paddingVertical: 6,
  },
});

export default UserPermissions;
