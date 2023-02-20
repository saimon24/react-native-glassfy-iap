import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { GlassfyProduct, GlassfySku, GlassfyOffering } from 'react-native-glassfy-module';
import { useGlassfy } from '../providers/GlassfyProvider';

interface OfferingGroupProps {
  group: GlassfyOffering;
}

// Represents one offering group with n SKU items to purchase
const OfferingGroup = ({ group }: OfferingGroupProps) => {
  const { purchase } = useGlassfy();

  const shouldPurchase = (sku: GlassfySku) => {
    purchase!(sku);
  };

  // FOrmat the price of a product
  const numberFormat = (product: GlassfyProduct) =>
    new Intl.NumberFormat('en-EN', {
      style: 'currency',
      currency: product.currencyCode,
    }).format(product.price);

  return (
    <View style={styles.offeringContainer}>
      <Text style={styles.offering}>{group.offeringId}</Text>

      <View style={styles.skuContainer}>
        {group.skus.map((sku) => (
          <TouchableOpacity key={sku.skuId} onPress={() => shouldPurchase(sku)} style={styles.skuButton}>
            <View style={styles.skuText}>
              <Text>{(sku.product as any).title}</Text>
              <Text style={styles.skuDesc}>{sku.product.description}</Text>
            </View>
            <View style={styles.skuPrice}>
              <Text>{numberFormat(sku.product)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  offeringContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    marginVertical: 4,
  },
  skuButton: {
    padding: 12,
    borderRadius: 4,
    margin: 4,
    flexDirection: 'row',
    width: '100%',
  },
  offering: {
    padding: 10,
    fontWeight: '500',
    width: '100%',
    fontSize: 20,
  },
  skuContainer: {
    marginVertical: 6,
    justifyContent: 'center',
  },
  skuText: {
    flexGrow: 1,
  },
  skuDesc: {
    color: '#B6B7C0',
    paddingVertical: 4,
  },
  skuPrice: {
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    borderColor: '#4000A4',
  },
});

export default OfferingGroup;
