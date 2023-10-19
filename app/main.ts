// (com as any).tns.Runtime.getCurrentRuntime().enableVerboseLogging();
// we need to use lat lon
import { install as installGestures } from '@nativescript-community/gesturehandler';
import { setGeoLocationKeys } from '@nativescript-community/gps';
import { installMixins as installUIMixins } from '@nativescript-community/systemui';
import { overrideSpanAndFormattedString } from '@nativescript-community/text';
import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';
import SwipeMenuElement from '@nativescript-community/ui-collectionview-swipemenu/svelte';
import DrawerElement from '@nativescript-community/ui-drawer/svelte';
import { Label } from '@nativescript-community/ui-label';
import { install as installBottomSheets } from '@nativescript-community/ui-material-bottomsheet';
import { installMixins, themer } from '@nativescript-community/ui-material-core';
import { Application, ScrollView, Trace, TraceErrorHandler } from '@nativescript/core';
import { svelteNative } from 'svelte-native';
import { FrameElement, PageElement, registerElement, registerNativeViewElement } from 'svelte-native/dom';
import WeatherPage from '~/components/WeatherPage.svelte';
import { start as startThemeHelper } from '~/helpers/theme';
import { startSentry } from '~/utils/sentry';
import './app.scss';

startSentry();
setGeoLocationKeys('lat', 'lon', 'altitude');
installGestures(true);
overrideSpanAndFormattedString();
installMixins();
installUIMixins();
installBottomSheets();

class NestedScrollView extends ScrollView {
    createNativeView() {
        if (__ANDROID__) {
            return new androidx.core.widget.NestedScrollView(this._context);
        }
        return super.createNativeView();
    }
}
registerElement('Frame', () => new FrameElement());
registerElement('Page', () => new PageElement());
registerNativeViewElement('AbsoluteLayout', () => require('@nativescript/core').AbsoluteLayout);
registerNativeViewElement('GridLayout', () => require('@nativescript/core').GridLayout);
registerNativeViewElement('image', () => require('@nativescript/core').Image);
registerNativeViewElement('ScrollView', () => NestedScrollView);
registerNativeViewElement('StackLayout', () => require('@nativescript/core').StackLayout);
// registerNativeViewElement('FlexboxLayout', () => require('@nativescript/core').FlexboxLayout);
// registerNativeViewElement('Switch', () => require('@nativescript/core').Switch);
registerNativeViewElement('textfield', () => require('@nativescript-community/ui-material-textfield').TextField, null, {}, { override: true });
registerNativeViewElement('slider', () => require('@nativescript-community/ui-material-slider').Slider, null, {}, { override: true });
registerNativeViewElement('WebView', () => require('@nativescript/core').WebView);

// registerNativeViewElement('mdtextfield', () => TextField, null, {}, { override: true });
// registerNativeViewElement(
//     'formattedstring',
//     () => require('@nativescript-community/text').LightFormattedString,
//     'formattedText',
//     {
//         spans: NativeElementPropType.ObservableArray
//     },
//     { override: true }
// );

//using 'spans' property breaks span(not cspan!) added without formattedstring
registerNativeViewElement('span', () => require('@nativescript/core').Span);
registerNativeViewElement('textfield', () => require('@nativescript-community/ui-material-textfield').TextField, null, {}, { override: true });
registerNativeViewElement('mdbutton', () => require('@nativescript-community/ui-material-button').Button);
registerNativeViewElement('label', () => Label as any, null, {}, { override: true });
registerNativeViewElement('activityIndicator', () => require('@nativescript-community/ui-material-activityindicator').ActivityIndicator);
registerNativeViewElement('lineChart', () => require('@nativescript-community/ui-chart/charts/LineChart').LineChart);
registerNativeViewElement('lottie', () => require('@nativescript-community/ui-lottie').LottieView);
registerNativeViewElement('pullrefresh', () => require('@nativescript-community/ui-pulltorefresh').PullToRefresh);
registerNativeViewElement('canvas', () => require('@nativescript-community/ui-canvas').CanvasView);
// registerNativeViewElement('line', () => require('@nativescript-community/ui-canvas/shapes/line').default);
registerNativeViewElement('rectangle', () => require('@nativescript-community/ui-canvas/shapes/rectangle').default);
// registerNativeViewElement('image', () => require('@nativescript-community/ui-image').Img, null, {}, { override: true });
registerNativeViewElement('canvaslabel', () => require('@nativescript-community/ui-canvaslabel').CanvasLabel);
registerNativeViewElement('cspan', () => require('@nativescript-community/ui-canvaslabel').Span);
registerNativeViewElement('cgroup', () => require('@nativescript-community/ui-canvaslabel').Group);
DrawerElement.register();
CollectionViewElement.register();
SwipeMenuElement.register();

// Trace.addCategories(DomTraceCategory);
// Trace.addCategories(Trace.categories.NativeLifecycle);
// Trace.addCategories(Trace.categories.Transition);
// Trace.addCategories(Trace.categories.Animation);
// Trace.addCategories(Trace.categories.All);
// Trace.enable();
// on startup we need to ensure theme is loaded because of a mixin
// on startup we need to say what we are using

Application.on(Application.launchEvent, () => {
    startThemeHelper();
});
if (__IOS__) {
    const variables = require('~/variables');
    const primaryColor = variables.primaryColor;
    themer.setPrimaryColor(primaryColor);
    themer.setAccentColor(primaryColor);
}

themer.createShape('round', {
    cornerFamily: 'rounded' as any,
    cornerSize: {
        value: 0.5,
        unit: '%'
    }
});
themer.createShape('none', {
    cornerFamily: 'rounded' as any,
    cornerSize: {
        value: 0,
        unit: '%'
    }
});

const errorHandler: TraceErrorHandler = {
    handlerError(err) {
        console.error('handlerError', err, err.stack);
        // Option 1 (development) - throw the error
        throw err;

        // Option 2 (development) - logging the error via write method provided from trace module

        // (production) - custom functionality for error handling
        // reportToAnalytics(err)
    }
};

svelteNative(WeatherPage, {});
