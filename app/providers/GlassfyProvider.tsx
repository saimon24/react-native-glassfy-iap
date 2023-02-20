import { createContext, useContext, useEffect, useState } from 'react';
import { Glassfy, GlassfyOffering, GlassfyPermission, GlassfySku, GlassfyTransaction, GLASSFY_LOGLEVEL } from 'react-native-glassfy-module';

interface GlassfyProps {
  purchase?: (sku: GlassfySku) => Promise<void>;
  restorePermissions?: () => Promise<GlassfySku>;
  user: UserState;
  offerings: GlassfyOffering[];
}

export interface UserState {
  gems: number;
  skins: string[];
  pro: boolean;
}

const GlassfyContext = createContext<GlassfyProps | null>(null);

// Change this to your Glassfy key
// https://dashboard.glassfy.io/0/settings
const GLASSFY_KEY = '96614bdd3fcf46c28ade1f4523612610';

// Provide Glassfy functions to our app
export const GlassfyProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserState>({ gems: 0, skins: [], pro: false });
  const [offerings, setOfferings] = useState<GlassfyOffering[]>([]);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Intialise Glassfy and set our provider ready
      await Glassfy.initialize(GLASSFY_KEY, false);
      setIsReady(true);
      // Glassfy.setLogLevel(GLASSFY_LOGLEVEL.ALL);

      // Load all offerings (products) and permissions (previous purchases)
      await loadOfferings();
      await loadPermissions();
    };
    init();
  }, []);

  // Load all offerings a user can purchase
  const loadOfferings = async () => {
    let offerings = await Glassfy.offerings();
    setOfferings(offerings.all);
  };

  // Load all permissions a user has
  const loadPermissions = async () => {
    let permissions = await Glassfy.permissions();
    handleExistingPermissions(permissions.all);
  };

  // Restore previous purchases
  const restorePermissions = async () => {
    let sku = await Glassfy.restorePurchases();
    return sku;
  };

  // Purchase one SKU and handle a successful transaction
  const purchase = async (sku: GlassfySku) => {
    const transaction = await Glassfy.purchaseSku(sku);

    if (transaction.receiptValidated) {
      handleSuccessfulTransactionResult(transaction, sku);
    }
  };

  // Update user state based on previous purchases
  const handleExistingPermissions = (permissions: GlassfyPermission[]) => {
    const newUser: UserState = { gems: 0, skins: [], pro: false };

    for (const perm of permissions) {
      if (perm.isValid) {
        if (perm.permissionId === 'skin_shark') {
          newUser.skins.push('Shark');
        } else if (perm.permissionId === 'skin_tiger') {
          newUser.skins.push('Tiger');
        } else if (perm.permissionId === 'pro_features') {
          newUser.pro = true;
        }
      }
    }
    setUser(newUser);
  };

  // Update the user state based on what we purchased
  const handleSuccessfulTransactionResult = (transaction: GlassfyTransaction, sku: GlassfySku) => {
    const productID = (transaction as any).productId;

    if (productID.indexOf('gems_100_consumable_1.99') >= 0) {
      setUser({ ...user, gems: (user.gems += +sku.extravars.gems) });
    }

    if (productID.indexOf('skin_tiger_nonconsumable_4.99') >= 0) {
      const skins = user.skins;
      skins.push(sku.extravars.skin);
      setUser({ ...user, skins });
    }

    if (productID.indexOf('skin_shark_nonconsumable_4.99') >= 0) {
      const skins = user.skins;
      skins.push(sku.extravars.skin);
      setUser({ ...user, skins });
    }

    if (productID.indexOf('glassfyapp_profeatures_monthly_9.99') >= 0) {
      setUser({ ...user, pro: true });
    }
  };

  const value = {
    loadPermissions,
    purchase,
    restorePermissions,
    user,
    offerings,
  };

  // Return empty fragment if provider is not ready (Glassfy not yet initialised)
  if (!isReady) return <></>;

  return <GlassfyContext.Provider value={value}>{children}</GlassfyContext.Provider>;
};

// Export context for easy usage
export const useGlassfy = () => {
  return useContext(GlassfyContext) as GlassfyProps;
};
