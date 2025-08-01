import React from 'react';
import { useLocation } from 'react-router-dom';

import { useRemoteConfig } from '@deriv/api';
import {
    useGrowthbookGetFeatureValue,
    useGrowthbookIsOn,
    useIntercom,
    useIsHubRedirectionEnabled,
    useLiveChat,
    useOauth2,
    useSilentLoginAndLogout,
} from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { ThemeProvider } from '@deriv-com/quill-ui';
import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { browserSupportsWebAuthn } from '@simplewebauthn/browser';

import initDatadog from '../Utils/Datadog';
import initHotjar from '../Utils/Hotjar';

import ErrorBoundary from './Components/Elements/Errors/error-boundary.jsx';
import LandscapeBlocker from './Components/Elements/LandscapeBlocker';
import AppToastMessages from './Containers/app-toast-messages.jsx';
import AppContents from './Containers/Layout/app-contents.jsx';
import Footer from './Containers/Layout/footer.jsx';
import Header from './Containers/Layout/header';
import AppModals from './Containers/Modals';
import Routes from './Containers/Routes/routes.jsx';
import Devtools from './Devtools';

const AppContent: React.FC<{ passthrough: unknown }> = observer(({ passthrough }) => {
    const store = useStore();
    const {
        has_wallet,
        is_logged_in,
        loginid,
        is_client_store_initialized,
        landing_company_shortcode,
        currency,
        residence,
        logout,
        email,
        setIsPasskeySupported,
        account_settings,
        setIsPhoneNumberVerificationEnabled,
        setIsCountryCodeDropdownEnabled,
        accounts,
    } = store.client;
    const { current_language, changeSelectedLanguage } = store.common;
    const { is_dark_mode_on, setDarkMode } = store.ui;

    const { isMobile } = useDevice();
    const { switchLanguage } = useTranslations();
    const location = useLocation();
    const has_access_denied_error = location.search.includes('access_denied');

    const { oAuthLogout } = useOauth2({
        handleLogout: async () => {
            await logout();
        },
    });
    const { isChangingToHubAppId } = useIsHubRedirectionEnabled();

    const is_app_id_set = localStorage.getItem('config.app_id');
    const is_change_login_app_id_set = localStorage.getItem('change_login_app_id');

    useSilentLoginAndLogout({
        is_client_store_initialized,
        oAuthLogout,
    });

    const [isWebPasskeysFFEnabled, isGBLoaded] = useGrowthbookIsOn({
        featureFlag: 'web_passkeys',
    });
    const [isServicePasskeysFFEnabled] = useGrowthbookIsOn({
        featureFlag: 'service_passkeys',
    });
    const [isPhoneNumberVerificationEnabled, isPhoneNumberVerificationGBLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'phone_number_verification',
    });
    const [isCountryCodeDropdownEnabled, isCountryCodeDropdownGBLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_country_code_dropdown',
    });
    const [isDuplicateLoginEnabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'duplicate-login',
    });

    const { data } = useRemoteConfig(true);
    const { tracking_datadog } = data;
    const is_passkeys_supported = browserSupportsWebAuthn();

    const livechat_client_information: Parameters<typeof useLiveChat>[0] = {
        is_client_store_initialized,
        is_logged_in,
        loginid,
        landing_company_shortcode,
        currency,
        residence,
        email,
        first_name: account_settings?.first_name,
        last_name: account_settings?.last_name,
    };

    useLiveChat(livechat_client_information);
    const active_account = accounts?.[loginid ?? ''];
    const token = active_account ? active_account.token : null;
    useIntercom(token);

    React.useEffect(() => {
        if (isChangingToHubAppId && !is_app_id_set) {
            const app_id = process.env.NODE_ENV === 'production' ? 61554 : 53503;
            localStorage.setItem('change_login_app_id', app_id.toString());
            return;
        }
        is_change_login_app_id_set && localStorage.removeItem('change_login_app_id');
    }, [isChangingToHubAppId, is_app_id_set, is_change_login_app_id_set]);

    React.useEffect(() => {
        switchLanguage(current_language);
    }, [current_language, switchLanguage]);

    React.useEffect(() => {
        if (isPhoneNumberVerificationGBLoaded) {
            setIsPhoneNumberVerificationEnabled(!!isPhoneNumberVerificationEnabled);
        }
    }, [isPhoneNumberVerificationEnabled, setIsPhoneNumberVerificationEnabled, isPhoneNumberVerificationGBLoaded]);

    React.useEffect(() => {
        if (isCountryCodeDropdownGBLoaded) {
            setIsCountryCodeDropdownEnabled(!!isCountryCodeDropdownEnabled);
        }
    }, [isCountryCodeDropdownEnabled, setIsCountryCodeDropdownEnabled, isCountryCodeDropdownGBLoaded]);

    React.useEffect(() => {
        if (isGBLoaded && isWebPasskeysFFEnabled && isServicePasskeysFFEnabled) {
            setIsPasskeySupported(
                is_passkeys_supported && isServicePasskeysFFEnabled && isWebPasskeysFFEnabled && isMobile
            );
        }
    }, [
        isServicePasskeysFFEnabled,
        isGBLoaded,
        isWebPasskeysFFEnabled,
        is_passkeys_supported,
        isMobile,
        setIsPasskeySupported,
    ]);

    React.useEffect(() => {
        initDatadog(tracking_datadog);
    }, [tracking_datadog]);

    React.useEffect(() => {
        if (is_client_store_initialized) initHotjar(store.client);
    }, [store.client, is_client_store_initialized]);

    // intentionally switch the user with wallets to light mode and EN language
    React.useLayoutEffect(() => {
        if (has_wallet) {
            if (is_dark_mode_on) {
                setDarkMode(false);
            }
        }
    }, [has_wallet, current_language, changeSelectedLanguage, is_dark_mode_on, setDarkMode]);

    const isCallBackPage = window.location.pathname.includes('callback');

    return (
        <ThemeProvider theme={is_dark_mode_on ? 'dark' : 'light'}>
            <LandscapeBlocker />
            {!isCallBackPage && <Header />}
            <ErrorBoundary root_store={store}>
                <AppContents>
                    <Routes passthrough={passthrough} />
                </AppContents>
            </ErrorBoundary>
            {!(isDuplicateLoginEnabled && has_access_denied_error) && <Footer />}
            <ErrorBoundary root_store={store}>
                <AppModals />
            </ErrorBoundary>
            <AppToastMessages />
            <Devtools />
        </ThemeProvider>
    );
});

export default AppContent;
