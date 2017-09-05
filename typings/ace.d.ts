declare module AceModule {
    interface NativeObjectStatic {
        new(nativeTypeName: string, ...constructorArgs: any[]): NativeObject;
        
        invoke(className: string, methodName: string, ...args: any[]): void;

        getField(className: string, fieldName: string, onSuccess: Function, onError: (err: Error) => void): void;
    }
    
    interface NativeObject {
        invoke(methodName: string, ...args: any[]): void;

        get(propertyName: string): any;
        
        set(propertyName: string, propertyValue: any): void;
        
        invalidate(propertyName: string, propertyValue: any): void;
        
        getField(fieldName: string, onSuccess: Function, onError: (err: Error) => void): void;
        
        getPrivateField(fieldName: string, onSuccess: Function, onError: (err: Error) => void): void;
        
        setField(fieldName: string, fieldvalue: any): void;
        
        addEventListener(eventName: string, func: (eventData: any, eventData2: any) => void): void;
        
        removeEventListener(eventName: string, func: Function): void;
        
        removeAllEventListeners(): void;
        
        raiseEvent(eventName: string, eventData: any, eventData2: any): void;
    }

    interface Page {
        getBottomAppBar(): any;
        setBottomAppBar(commandBar: any): void;

        getTopAppBar(): any;
        setTopAppBar(commandBar: any): void;

        getCommandBar(): any;
        setCommandBar(commandBar: any): void;

        getTitle(): string;
        setTitle(title: string): void;

        getTintColor(): any;
        setTintColor(brush: any): void;

        getBarTintColor(): any;
        setBarTintColor(brush: any): void;
    }

    interface WebView {
        getSource(): string;
        
        setSource(url: string): void;
    }

    interface AceAndroidAppWidgetStatic {
        clear(): void;

        add(text: string): void;
    }

    interface AceAndroidStatic {
        ifVersionAtLeast(version: number, onTrue: (version: number) => void, onFalse: (version: number) => void): void;

        getContext(): NativeObject;

        getActivity(): NativeObject;

        getIntent(): NativeObject;

        getId(name: string, onSuccess: Function, onError: Function): void;

        startActivity(name: string, onSuccess: Function, onError: Function): void;

        appWidget: AceAndroidAppWidgetStatic;

        version: {
            BASE: 1,
            BASE_1_1: 2,
            CUPCAKE: 3,
            CUR_DEVELOPMENT: 10000,
            DONUT: 4,
            ECLAIR: 5,
            ECLAIR_0_1: 6,
            ECLAIR_MR1: 7,
            FROYO: 8,
            GINGERBREAD: 9,
            GINGERBREAD_MR1: 10,
            HONEYCOMB: 11,
            HONEYCOMB_MR1: 12,
            HONEYCOMB_MR2: 13,
            ICE_CREAM_SANDWICH: 14,
            ICE_CREAM_SANDWICH_MR1: 15,
            JELLY_BEAN: 16,
            JELLY_BEAN_MR1: 17,
            JELLY_BEAN_MR2: 18,
            KITKAT: 19,
            KITKAT_WATCH: 20,
            LOLLIPOP: 21,
            LOLLIPOP_MR1: 22,
            M: 23
        }
    }

    interface AceiOSStatic {
        getNavigationController(): NativeObject;

        getPresentedViewControllerAsync(onSuccess: (controller: NativeObject) => void): void;

        getCurrentModalContent(): NativeObject;

        setCurrentModalContent(content: any): void;
    }

    interface AceModuleStatic {
        NativeObject: NativeObjectStatic;

        android: AceAndroidStatic;

        ios: AceiOSStatic;

        valueOn(platformValues: any): any;

        isSupported(onSuccess: (winParam: any) => void, onError: () => void): void;

        navigate(urlOrUIElement: string | NativeObject, onNavigated: (root: NativeObject) => void,
                 onNavigatingAway: () => void, onError: (err: Error) => void);

        load(url: string, onSuccess: (root: NativeObject) => void, onError: (err: Error) => void): void;

        goBack(): void;

        getHostPage(): Page;

        getHostWebView(): WebView;

        setPopupsCloseOnHtmlNavigation(value: boolean): void;

        addEventListener(event: string, func: (eventData1: any, eventData2: any) => void): void;

        removeEventListener(event: string, func: (eventData1: any, eventData2: any) => void): void;

        raiseEvent(event: string, eventData1: any, eventData2: any): void;
    }
}

declare var ace: AceModule.AceModuleStatic;