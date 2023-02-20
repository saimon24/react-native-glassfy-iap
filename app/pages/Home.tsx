import { Button, ScrollView } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useGlassfy } from '../providers/GlassfyProvider';
import { useNavigation } from '@react-navigation/native';
import OfferingGroup from '../components/OfferingGroup';
import UserPermissions from '../components/UserPermissions';

const Home = () => {
  const navigation = useNavigation();
  const { restorePermissions, user, offerings } = useGlassfy();

  // Add a button to the top bar
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button onPress={restore} title="Restore" color={'#4000A4'}></Button>,
    });
  }, []);

  const restore = async () => {
    try {
      const permissions = await restorePermissions!();
      console.log(permissions);
      // Handle those permissions!
    } catch (e) {
      alert(e);
    }
  };

  return (
    <ScrollView>
      {offerings.map((group) => (
        <OfferingGroup group={group} key={group.offeringId} />
      ))}

      <UserPermissions user={user} />
    </ScrollView>
  );
};

export default Home;
