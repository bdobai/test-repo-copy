package com.spoonity.costacoffee3;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.visilabs.Visilabs;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import euromsg.com.euromobileandroid.EuroMobileManager;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    initEuroMessage();
  }

    private void initEuroMessage() {
        String appAlias = "demo-alias";
        String huaweiAppAlias = "demo-alias-huawei";
        String organizationId = "OID";
        String siteId = "SID";
        String datasource = "datasource";
        String channel = "Android";
        String segmentUrl = "http://lgr.visilabs.net";
        String realtimeUrl = "http://rt.visilabs.net";
        String targetUrl = "http://s.visilabs.net/json";
        String actionUrl = "http://s.visilabs.net/actjson";
        String geofenceUrl = "http://s.visilabs.net/geojson";

        Visilabs.CreateAPI(organizationId, siteId, segmentUrl,
                datasource, realtimeUrl, channel, this, targetUrl, actionUrl, 30000, geofenceUrl, true);

        EuroMobileManager euroMobileManager = EuroMobileManager.init(appAlias, huaweiAppAlias, this);

        // optional
        euroMobileManager.setPushIntent("com.pushsdk.MainActivity", this);
        euroMobileManager.setNotificationTransparentSmallIcon(R.drawable.ic_launcher, this);
        euroMobileManager.setNotificationTransparentSmallIconDarkMode(R.drawable.ic_launcher, this);
        euroMobileManager.useNotificationLargeIcon(true);
        euroMobileManager.setNotificationLargeIcon(R.drawable.ic_launcher, this);
        euroMobileManager.setNotificationLargeIconDarkMode(R.drawable.ic_launcher, this);
        euroMobileManager.setNotificationColor("#d1dbbd");
        euroMobileManager.setChannelName("Channel", this);
    }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.spoonity.costacoffee3.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
